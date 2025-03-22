class CreateDashboards < ActiveRecord::Migration[8.0]
  def change
    create_table :dashboards do |t|
      t.string :container_id
      t.string :background_image

      t.timestamps
    end
    add_index :dashboards, :container_id
  end
end
