class Task < ApplicationRecord
  enum :task_type, [ :template_task, :dashboard_task ]

  # Associations
  belongs_to :list
  has_one :dashboard_task, dependent: :destroy

  # description and position attributes, position greater or equal to 0
  validates :description, :task_type, presence: true
  validates :position, numericality: { greater_than_or_equal_to: 0 }
end
