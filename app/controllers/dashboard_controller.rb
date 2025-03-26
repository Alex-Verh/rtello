class DashboardController < ApplicationController
  before_action :authenticate_user!
  before_action :set_dashboard, only: [ :index ] # ensure it exists
  before_action :authorize_user!, only: [ :index ]
  before_action :track_dashboard

  def index
    @is_owner = @dashboard.container.user_id == current_user.id # check if user is the owner
  end

  private # not accessible via HTTP

  # Check if dashboard exists
  def set_dashboard
    # load `container`, `members`, and their associated `user`
    @dashboard = Dashboard.includes(:container, members: :user).find_by(id: params[:id])
    unless @dashboard
      redirect_to root_path, alert: "Dashboard not found."
    end
  end

  # Check if user is a member or owner
  def authorize_user!
    unless @dashboard.container.user_id == current_user.id || @dashboard.members.exists?(user_id: current_user.id)
      redirect_to root_path, alert: "You are not a member of this dashboard."
    end
  end

  def track_dashboard
    session[:visited_dashboards] ||= [] # init if not exist
    session[:visited_dashboards].delete(params[:id]) # remove if dashboard id already there
    session[:visited_dashboards].unshift(params[:id]) # add the new dashboard at the front
    session[:visited_dashboards] = session[:visited_dashboards].take(3) # keep only the last 3
  end
end
