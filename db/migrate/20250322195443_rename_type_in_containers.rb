class RenameTypeInContainers < ActiveRecord::Migration[8.0]
  def change
    rename_column :containers, :type, :container_type
  end
end
