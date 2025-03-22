# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_03_22_193652) do
  create_schema "auth"
  create_schema "extensions"
  create_schema "graphql"
  create_schema "graphql_public"
  create_schema "pgbouncer"
  create_schema "pgsodium"
  create_schema "pgsodium_masks"
  create_schema "realtime"
  create_schema "storage"
  create_schema "vault"

  # These are extensions that must be enabled in order to support this database
  enable_extension "extensions.pg_stat_statements"
  enable_extension "extensions.pgcrypto"
  enable_extension "extensions.pgjwt"
  enable_extension "extensions.uuid-ossp"
  enable_extension "graphql.pg_graphql"
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pgsodium.pgsodium"
  enable_extension "vault.supabase_vault"

  create_table "containers", force: :cascade do |t|
    t.string "name"
    t.bigint "user_id"
    t.integer "type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_containers_on_user_id"
  end

  create_table "dashboard_tasks", force: :cascade do |t|
    t.bigint "task_id"
    t.string "state"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["task_id"], name: "index_dashboard_tasks_on_task_id"
  end

  create_table "dashboards", force: :cascade do |t|
    t.bigint "container_id"
    t.string "background_image"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["container_id"], name: "index_dashboards_on_container_id"
  end

  create_table "lists", force: :cascade do |t|
    t.bigint "container_id"
    t.string "name"
    t.integer "position"
    t.integer "type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["container_id"], name: "index_lists_on_container_id"
  end

  create_table "members", force: :cascade do |t|
    t.bigint "dashboard_id"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["dashboard_id"], name: "index_members_on_dashboard_id"
    t.index ["user_id"], name: "index_members_on_user_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.bigint "list_id"
    t.string "description"
    t.integer "position"
    t.integer "type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["list_id"], name: "index_tasks_on_list_id"
  end

  create_table "templates", force: :cascade do |t|
    t.bigint "container_id"
    t.integer "usage_count"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["container_id"], name: "index_templates_on_container_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "first_name"
    t.string "last_name"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "containers", "users"
  add_foreign_key "dashboard_tasks", "tasks"
  add_foreign_key "dashboards", "containers"
  add_foreign_key "lists", "containers"
  add_foreign_key "members", "dashboards"
  add_foreign_key "members", "users"
  add_foreign_key "tasks", "lists"
  add_foreign_key "templates", "containers"
end
