class Api::ListsController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_user

  def show
    list = List.find(params[:id])
    render json: list
  rescue ActiveRecord::RecordNotFound
    render json: { error: "List not found" }, status: :not_found
  end

  def create
    list = List.new(list_params)
    if list.save
      render json: list, status: :created
    else
      render json: { errors: list.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    list = List.find(params[:id])
    list.destroy
    render json: { success: true, message: "List deleted" }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "List not found" }, status: :not_found
  end

  def update
    list = List.find(params[:id])
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
    list = List.find_by(id: params[:id])
    return render json: { error: "List not found" }, status: :not_found if list.nil?

    container = Container.find_by(id: list.container_id)
    return render json: { error: "Container not found" }, status: :not_found if container.nil?

    case container.container_type # switch case when template check only if leader when dashboard if leader or member
    when :template
      unless container.container.user_id == current_user.id
        render json: { error: "Unauthorized: Only the leader can manage this template" }, status: :forbidden
      end
    when :dashboard
      unless container.container.user_id == current_user.id || container.members.exists?(member_id: current_user.id)
        render json: { error: "Unauthorized: You must be the leader or a member of this dashboard" }, status: :forbidden
      end
    end
  end

  def list_params
    params.require(:list).permit(:name, :position, :container_id)
  end
end
