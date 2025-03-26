class Api::ListsController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_user

  def create
    # get max position
    container = Container.find(params[:list][:container_id])
    max_position = container.lists.maximum(:position) || 0

    list = List.new(list_params.merge(position: max_position + 1))
    if list.save
      render json: list, status: :created
    else
      render json: { errors: list.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    list = List.find(params[:list][:id])
    list.destroy
    render json: { success: true, message: "List deleted" }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "List not found" }, status: :not_found
  end

  def update
    list = List.find(params[:list][:id])
    if list.update(list_params)
      render json: list
    else
      render json: { errors: list.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "List not found" }, status: :not_found
  end

  def reorder
    params[:lists].each do |list_data|
      list = List.find(list_data[:id])
      list.update(position: list_data[:position])
    end
    render json: { success: true, message: "Lists reordered successfully" }, status: :ok
  end


  private

  # Check if user can manage this list
  def authorize_user
    # if the list already exists retrieve it, but if not try to find container by container_id
    if params[:list][:id] && action_name != "create"
      list = List.find_by(id: params[:list][:id])
      return render json: { error: "List not found" }, status: :not_found if list.nil?
      container_id = list.container_id
    else
      container_id = params[:list][:container_id]
    end

    container = Container.find_by(id: container_id)
    return render json: { error: "Container not found" }, status: :not_found if container.nil?

    case container.container_type # switch case when template check only if creator when dashboard if leader or member
    when :template
      unless container.container.user_id == current_user.id
        render json: { error: "Unauthorized: Only the creator can manage this template" }, status: :forbidden
      end
    when :dashboard
      unless container.container.user_id == current_user.id || container.members.exists?(user_id: current_user.id)
        render json: { error: "Unauthorized: You must be the leader or a member of this dashboard" }, status: :forbidden
      end
    end
  end

  def list_params
    params.require(:list).permit(:name, :position, :container_id)
  end
end
