class CreateContainers < ActiveRecord::Migration[8.0]
  def change
    create_table :containers do |t|
      t.string :name
      t.string :user_id
      t.integer :type

      t.timestamps
    end
    add_index :containers, :user_id
  end
end
