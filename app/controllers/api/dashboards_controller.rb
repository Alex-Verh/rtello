class Api::DashboardsController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_leader, only: [ :destroy, :update, :add_member ]

  def create
    # create container first
    ActiveRecord::Base.transaction do
      container = Container.create!(
        name: params[:name],
        container_type: :dashboard,
        user_id: current_user.id
      )
      dashboard = container.create_dashboard!(dashboard_params)

      # background processing for image resizing
      ProcessDashboardBackgroundJob.perform_later(dashboard.id) if dashboard.background_image?

      dashboard.save!
      render json: dashboard, status: :created
    end
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def create_from_template
    template = Template.find(params[:template_id])
    templateContainer = template.container

    ActiveRecord::Base.transaction do
      # create container
      container = Container.create!(
        name: params[:name],
        container_type: :dashboard,
        user_id: current_user.id
      )
      # create dashboard
      dashboard = container.create_dashboard!(dashboard_params)

      template.increment!(:usage_count) # add the usage count

      # copy all lists
      templateContainer.lists.each do |template_list|
        new_list = container.lists.create!(
          name: template_list.name,
          position: template_list.position,
        )

        # copy all tasks for each list
        template_list.tasks.each do |template_task|
          new_task = new_list.tasks.create!(
            description: template_task.description,
            position: template_task.position
          )
          new_task.create_dashboard_task! # besides regular task create dashboard task
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

      # background processing for image resizing
      ProcessDashboardBackgroundJob.perform_later(dashboard.id) if dashboard.background_image?

      render json: dashboard
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Dashboard not found" }, status: :not_found
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end


  def add_member
    dashboard = Dashboard.find(params[:id])

    user = User.find_by(email: params[:email])
    return render json: { error: "Such user not found" }, status: :not_found if user.nil?

    # Check if the user is already a member or if leader wants to add himself
    if dashboard.members.exists?(user_id: user.id) || user.id == current_user.id
      return render json: { error: "User is already a member" }, status: :unprocessable_entity
    end

    member = dashboard.members.create!(user_id: user.id)

    render json: member.as_json.merge(full_name: user.full_name), status: :created # add full name as well in response
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Dashboard not found" }, status: :not_found
  end

  def delete_member
    dashboard = Dashboard.find(params[:id])
    member = dashboard.members.find(params[:member_id])

    return render json: { error: "Member not found" }, status: :not_found if member.nil?

    # if a leader or user themselves
    if current_user.id == member.user_id || current_user.id == dashboard.container.user_id
      member.destroy
      is_self = current_user.id == member.user_id
      message = is_self ? "You have left the dashboard" : "Member removed by leader"
      render json: { success: true, message: message, is_self: is_self }
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
    params.fetch(:dashboard, {}).permit(:background_image)
  end

  def user_params
    params.request(:user).permit(:id, :email)
  end
end
