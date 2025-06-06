class Api::TasksController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_user


  def create
    # get max position
    list = List.find(params[:task][:list_id])
    max_position = list.tasks.maximum(:position) || 0

    task = Task.new(task_params.merge(position: max_position + 1))
    if task.save
      DashboardTask.create(task: task) if list.container.dashboard?
      render json: task, status: :created
    else
      render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    task = Task.find(params[:id])
    task.destroy
    render json: { success: true, message: "Task deleted" }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Task not found" }, status: :not_found
  end

  def update
    task = Task.find(params[:id])
    if task.update(task_params)
      render json: task
    else
      render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Task not found" }, status: :not_found
  end

  def update_state
    task = Task.find(params[:id])
    dashboard_task = task.dashboard_task

    if dashboard_task.nil?
      render json: { error: "This task is not a dashboard task" }, status: :unprocessable_entity
      return
    end

    dashboard_task.toggle_state!

    render json: { success: true, task: task, dashboard_task: dashboard_task }
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Task not found" }, status: :not_found
  rescue AASM::InvalidTransition
    render json: { error: "Invalid state transition" }, status: :unprocessable_entity
  end

  def reorder
    params[:tasks].each do |task_data|
      task = Task.find(task_data[:id])
      task.update(list_id: task_data[:list_id], position: task_data[:position])
    end
    render json: { success: true, message: "Tasks reordered successfully" }, status: :ok
  end

  private

  # Check if user can manage this task
  def authorize_user
    # if the task already exists retrieve it, but if not try to find list by list_id
    if params[:id] && action_name != "create"
      task = Task.find_by(id: params[:id])
      return render json: { error: "Task not found" }, status: :not_found if task.nil?
      list_id = task.list_id
    elsif params[:tasks] && action_name == "reorder"
      list_id = params[:tasks].first[:list_id]
    else
      list_id = params[:task][:list_id]
    end

    list = List.find_by(id: list_id)
    return render json: { error: "List not found" }, status: :not_found if list.nil?

    container = Container.find_by(id: list.container_id)
    return render json: { error: "Container not found" }, status: :not_found if container.nil?

    case container.container_type.to_sym # switch case when template check only if leader when dashboard if leader or member
    when :template
      unless container.user_id.to_s == current_user.id.to_s
        render json: { error: "Unauthorized: Only the leader can manage this template" }, status: :forbidden
      end
    when :dashboard
      unless container.user_id.to_s == current_user.id.to_s || container.members.exists?(user_id: current_user.id)
        render json: { error: "Unauthorized: You must be the leader or a member of this dashboard" }, status: :forbidden
      end
    end
  end

  def task_params
    params.require(:task).permit(:description, :position, :list_id)
  end
end
