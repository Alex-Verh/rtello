class Api::DashboardsController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_leader, only: [ :destroy, :update ]

  def create
    # create container first
    ActiveRecord::Base.transaction do
      container = Container.create!(
        name: params[:name],
        container_type: :dashboard,
        user_id: current_user.id
      )
      dashboard = container.create_dashboard!(dashboard_params)
      dashboard.save!
      render json: dashboard, status: :created
    end
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def create_from_template
    print(params)
    templateContainer = Container.find(params[:template_id])

    ActiveRecord::Base.transaction do
      # create container
      container = Container.create!(
        name: params[:name],
        container_type: :dashboard,
        user_id: current_user.id
      )
      # create dashboard
      dashboard = container.create_dashboard!(dashboard_params)

    # copy all lists
    templateContainer.lists.each do |template_list|
      new_list = container.lists.create!(
        name: template_list.name,
        position: template_list.position,
      )

      # copy all tasks for each list
      template_list.tasks.each do |template_task|
        new_list.tasks.create!(
          description: template_task.description,
          position: template_task.position,
        )
        DashboardTask.create(task: template_task) # besides regular task create dashboard task
      end
    end

      render json: dashboard, status: :created
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Template not found" }, status: :not_found
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def destroy
    dashboard = Dashboard.find(params[:id])
    container = dashboard.container
    ActiveRecord::Base.transaction do
      container.destroy!  # dashboard will be removed automatically
      render json: { success: true, message: "Dashboard and container deleted" }, status: :ok
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Dashboard not found" }, status: :not_found
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def update
    dashboard = Dashboard.find(params[:id])
    container = dashboard.container

    ActiveRecord::Base.transaction do
      container.update!(name: params[:name]) if params[:name].present?
      dashboard.update!(dashboard_params)

      render json: dashboard
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Dashboard not found" }, status: :not_found
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def delete_member
    dashboard = Dashboard.find(params[:id])
    member = dashboard.members.find_by(id: params[:member_id])

    return render json: { error: "Member not found" }, status: :not_found if member.nil?

    # if a leader or user themselves
    if current_user.id == member.user_id || current_user.id == dashboard.container.user_id
      member.destroy
      message = current_user.id == member.user_id ? "You have left the dashboard" : "Member removed by leader"
      render json: { success: true, message: message }
    else
      render json: { error: "Unauthorized: You cannot remove other members unless you are a leader." }, status: :forbidden
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Dashboard not found" }, status: :not_found
  end

  private

  # Check if user is leader of dashboard
  def authorize_leader
    dashboard = Dashboard.find_by(id: params[:id])
    return render json: { error: "Dashboard not found" }, status: :not_found if dashboard.nil?

    unless dashboard.container.user_id == current_user.id
      render json: { error: "Unauthorized: You must be the leader of this dashboard" }, status: :forbidden
    end
  end

  def dashboard_params
    params.fetch(:dashboard, {}).permit(:background_img)
  end
end
