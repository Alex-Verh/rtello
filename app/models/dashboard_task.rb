class DashboardTask < ApplicationRecord
  include AASM

  # Associations
  belongs_to :task

  # AASM for state management: complete <---> incomplete
  aasm column: "state" do
    state :not_completed, initial: true
    state :completed

    event :complete do
      transitions from: :not_completed, to: :completed
    end

    event :incomplete do
      transitions from: :completed, to: :not_completed
    end
  end
end
