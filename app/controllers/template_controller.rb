class TemplateController < ApplicationController
  before_action :authenticate_user!
  before_action :set_template, only: [ :index ] # ensure it exists

  def index
    @is_owner = @template.container.user_id == current_user.id # check if user is the owner
  end

  private # not accessible via HTTP

  # Check if template exists
  def set_template
    @template = Template.includes(:container).find_by(id: params[:id])
    unless @template
      redirect_to root_path, alert: "Template not found."
    end
  end
end
