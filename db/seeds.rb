require 'faker'

# Method to reset sequences for PostgreSQL
def reset_sequences
  ActiveRecord::Base.connection.tables.each do |table|
    ActiveRecord::Base.connection.reset_pk_sequence!(table)
  end
end

# REMOVE EXISTING DATA
DashboardTask.delete_all
Task.delete_all
List.delete_all
Member.delete_all
Dashboard.delete_all
Template.delete_all
Container.delete_all
User.delete_all

# Reset sequences for all tables
reset_sequences

# Create 10 users
10.times do
  user = User.create!(
    first_name: Faker::Name.first_name,
    last_name: Faker::Name.last_name,
    email: Faker::Internet.email,
    password: 'password123'
  )

  # Create 2 containers for each user
  2.times do
    container = user.containers.create!(
      name: Faker::Company.name,
      container_type: Container.container_types.keys.sample
    )

    # Create dashboard or template for the container
    if container.dashboard?
      # Ensure the container doesn't already have a dashboard
      unless container.dashboard
        container.create_dashboard!
      end
    else
      # Ensure the container doesn't already have a template
      unless container.template
        container.create_template!(usage_count: rand(0..10))
      end
    end

    # Create 3 lists in the container
    3.times do |i|
      list = container.lists.create!(
        name: Faker::Lorem.word,
        position: i,
        list_type: List.list_types.keys.sample
      )

      # Create 5 tasks in the list
      5.times do |j|
        task = list.tasks.create!(
          description: Faker::Lorem.sentence,
          position: j,
          task_type: Task.task_types.keys.sample
        )

        # If the task is a dashboard_task, create an entry for it
        if task.dashboard_task?
          task.create_dashboard_task!
        end
      end
    end

    # Create association between user and dashboard (if it exists)
    if container.dashboard?
      3.times do
        Member.create!(
          dashboard: container.dashboard, # Use container.dashboard instead of dashboard
          user: User.all.sample
        )
      end
    end
  end
end

puts "Fake data generation completed!"
