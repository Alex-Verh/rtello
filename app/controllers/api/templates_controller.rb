class Api::TemplatesController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_leader, only: [ :destroy, :update ]


  def search
    query = params[:query]
    templates = Template.joins(:container)
    .where("containers.name ILIKE ?", "%#{query}%")
    .where(containers: { user_id: current_user.id })
    .limit(10)
    render json: templates
  end

  def create
    # create container first
    ActiveRecord::Base.transaction do
      container = Container.create!(
        name: params[:name],
        container_type: :template,
        user_id: current_user.id
      )
      template = container.create_template!(template_params.merge(usage_count: 0)) # when creating it, usage count is 0
      template.save!
      render json: template, status: :created
    end
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def destroy
    template = Template.find(params[:id])
    container = template.container
    ActiveRecord::Base.transaction do
      container.destroy!  # template will be removed automatically
      render json: { success: true, message: "Template and container deleted" }, status: :ok
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Template not found" }, status: :not_found
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def update
    template = Template.find(params[:id])
    container = template.container

    ActiveRecord::Base.transaction do
      container.update!(name: params[:name]) if params[:name].present?
      template.update!(template_params)

      render json: template
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Template not found" }, status: :not_found
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end


  private

  # Check if user is leader of template
  def authorize_leader
    template = Template.find_by(id: params[:id])
    return render json: { error: "Template not found" }, status: :not_found if template.nil?

    unless template.container.user_id == current_user.id
      render json: { error: "Unauthorized: You must be the leader of this template" }, status: :forbidden
    end
  end


  def template_params
    params.fetch(:template, {}).permit()
  end
end
