class CreateMembers < ActiveRecord::Migration[8.0]
  def change
    create_table :members do |t|
      t.string :dashboard_id
      t.string :user_id

      t.timestamps
    end
    add_index :members, :dashboard_id
    add_index :members, :user_id
  end
end
