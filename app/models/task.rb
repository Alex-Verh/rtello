class Task < ApplicationRecord
  include AASM

  enum type: { TemplateTask: 0, DashboardTask: 1 }

  # Associations
  belongs_to :list
  has_one :dashboard_task, dependent: :destroy

  # description and position attributes, position greater or equal to 0
  validates :description, presence: true
  validates :position, numericality: { greater_than_or_equal_to: 0 }
end
