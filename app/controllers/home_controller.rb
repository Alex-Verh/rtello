class HomeController < ApplicationController
  before_action :authenticate_user!

  def index
    @own_dashboards = Dashboard.includes(:container)
    .where(containers: { user_id: current_user.id })

    @other_dashboards = Dashboard.includes(:container)
    .left_joins(:members)
    .where("members.user_id = :user_id", user_id: current_user.id)
    .distinct
  end

  def templates
    @own_templates = Template.includes(:container).where(containers: { user_id: current_user.id })

    @popular_templates = Template.includes(:container)
    .group("templates.id")
    .order("COUNT(usages.id) DESC")
    .limit(4)
  end
end
