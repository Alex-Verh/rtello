class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :load_user_containers, if: :user_signed_in?

  protected

  def configure_permitted_parameters
    # Permit `first_name` and `last_name` for sign-up
    devise_parameter_sanitizer.permit(:sign_up, keys: [ :first_name, :last_name ])

    # Permit `first_name` and `last_name` for account updates
    devise_parameter_sanitizer.permit(:account_update, keys: [ :first_name, :last_name ])
  end


  private

  # all dashboards and templates of the authenticated user
  def load_user_containers
  @all_dashboards = Dashboard.includes(:container)
  .left_joins(:members)
  .where(containers: { user_id: current_user.id })
  .where("containers.user_id = :user_id OR members.user_id = :user_id", user_id: current_user.id)
  .distinct

  @all_templates = Template.includes(:container)
  .where(containers: { user_id: current_user.id })
  end
end
