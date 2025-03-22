class CreateTasks < ActiveRecord::Migration[8.0]
  def change
    create_table :tasks do |t|
      t.string :list_id
      t.string :description
      t.integer :position
      t.integer :type

      t.timestamps
    end
    add_index :tasks, :list_id
  end
end
