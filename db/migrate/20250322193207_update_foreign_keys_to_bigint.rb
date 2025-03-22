class UpdateForeignKeysToBigint < ActiveRecord::Migration[8.0]
  def change
    # Change `container_id` to bigint in `lists`
    change_column :lists, :container_id, :bigint, using: 'container_id::bigint'

    # Change `list_id` to bigint in `tasks`
    change_column :tasks, :list_id, :bigint, using: 'list_id::bigint'

    # Change `dashboard_id` to bigint in `dashboard_members`
    change_column :members, :dashboard_id, :bigint, using: 'dashboard_id::bigint'

    # Change `user_id` to bigint in `dashboard_members`
    change_column :members, :user_id, :bigint, using: 'user_id::bigint'

    # Change `container_id` to bigint in `dashboards`
    change_column :dashboards, :container_id, :bigint, using: 'container_id::bigint'

    # Change `container_id` to bigint in `templates`
    change_column :templates, :container_id, :bigint, using: 'container_id::bigint'
  end
end
