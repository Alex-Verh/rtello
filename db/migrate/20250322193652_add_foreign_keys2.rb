class AddForeignKeys2 < ActiveRecord::Migration[8.0]
  def change
    change_column :containers, :user_id, :bigint, using: 'user_id::bigint'
    add_foreign_key :containers, :users, column: :user_id, primary_key: :id

    change_column :dashboard_tasks, :task_id, :bigint, using: 'task_id::bigint'
    add_foreign_key :dashboard_tasks, :tasks, column: :task_id, primary_key: :id
  end
end
