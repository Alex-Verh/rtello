class RemoveListTypeAndTaskTypeFromTables < ActiveRecord::Migration[8.0]
  def change
    remove_column :lists, :list_type, :integer
    remove_column :tasks, :task_type, :integer
  end
end
