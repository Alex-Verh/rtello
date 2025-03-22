class RenameTypeInLists < ActiveRecord::Migration[8.0]
  def change
    rename_column :lists, :type, :list_type
  end
end
