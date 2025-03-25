class Api::DashboardsController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_leader [only :show, :destroy, :update]
  before_action :authorize_member [only :show]

  def show
    dashboard = Dashboard.find(params[:id])
    render json: dashboard
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Dashboard not found" }, status: :not_found
  end

  def create
    # create container first
    ActiveRecord::Base.transaction do
      container = Container.create!(
        name: params[:name],
        container_type: :dashboard,
        user_id: current_user.id
      )
      dashboard = container.build_dashboard(dashboard_params)
      dashboard.save!
      render json: dashboard, status: :created
    end
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
    if current_user.id == member.member_id || current_user.id == dashboard.container.user_id
      member.destroy
      message = current_user.id == member.member_id ? "You have left the dashboard" : "Member removed by leader"
      render json: { success: true, message: message }
    else
      render json: { error: "Unauthorized: You cannot remove other members unless you are a leader." }, status: :forbidden
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Dashboard not found" }, status: :not_found
  end

  private

  # Check if user is leader of dashboard
  def authorize_user
    dashboard = Dashboard.find_by(id: params[:id])
    return render json: { error: "Dashboard not found" }, status: :not_found if dashboard.nil?

    unless dashboard.container.user_id == current_user.id
      render json: { error: "Unauthorized: You must be the leader of this dashboard" }, status: :forbidden
    end
  end

  # Check if user is member of dashboard
  def authorize_member
    dashboard = Dashboard.find_by(id: params[:id])
    return render json: { error: "Dashboard not found" }, status: :not_found if dashboard.nil?

    unless dashboard.members.exists?(member_id: current_user.id)
      render json: { error: "Unauthorized: You must be a member of this dashboard" }, status: :forbidden
    end
  end

  def dashboard_params
    params.require(:dashboard).permit(:background_img)
  end
end
