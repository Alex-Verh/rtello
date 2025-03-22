class AddForeignKeys < ActiveRecord::Migration[8.0]
  def change
    # Add foreign key to `lists` table
    add_foreign_key :lists, :containers, column: :container_id, primary_key: :id

    # Add foreign key to `tasks` table
    add_foreign_key :tasks, :lists, column: :list_id, primary_key: :id

    # Add foreign key to `dashboard_members` table for `dashboards`
    add_foreign_key :members, :dashboards, column: :dashboard_id, primary_key: :id

    # Add foreign key to `dashboard_members` table for `users`
    add_foreign_key :members, :users, column: :user_id, primary_key: :id

    # Add foreign key to `dashboards` table
    add_foreign_key :dashboards, :containers, column: :container_id, primary_key: :id

    # Add foreign key to `templates` table
    add_foreign_key :templates, :containers, column: :container_id, primary_key: :id
  end
end
