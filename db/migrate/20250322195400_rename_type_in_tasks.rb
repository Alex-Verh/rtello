class RenameTypeInTasks < ActiveRecord::Migration[8.0]
  def change
    rename_column :tasks, :type, :task_type
  end
end
