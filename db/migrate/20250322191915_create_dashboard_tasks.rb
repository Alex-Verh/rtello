class CreateDashboardTasks < ActiveRecord::Migration[8.0]
  def change
    create_table :dashboard_tasks do |t|
      t.string :task_id
      t.string :state

      t.timestamps
    end
    add_index :dashboard_tasks, :task_id
  end
end
