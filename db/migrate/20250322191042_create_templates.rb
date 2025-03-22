class CreateTemplates < ActiveRecord::Migration[8.0]
  def change
    create_table :templates do |t|
      t.string :container_id
      t.integer :usage_count

      t.timestamps
    end
    add_index :templates, :container_id
  end
end
