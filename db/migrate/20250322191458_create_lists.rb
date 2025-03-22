class CreateLists < ActiveRecord::Migration[8.0]
  def change
    create_table :lists do |t|
      t.string :container_id
      t.string :name
      t.integer :position
      t.integer :type

      t.timestamps
    end
    add_index :lists, :container_id
  end
end
