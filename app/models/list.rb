class List < ApplicationRecord
  enum :list_type, [ :dashboard_list, :template_list ]

  # Associations
  belongs_to :container
  has_many :tasks, dependent: :destroy

  # name and position attributes, position greater or equal to 0
  validates :name, :list_type, presence: true
  validates :position, numericality: { greater_than_or_equal_to: 0 }
end
