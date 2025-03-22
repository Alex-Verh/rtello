class List < ApplicationRecord
  enum type: { List: 0, TemplateList: 1 }

  # Associations
  belongs_to :container
  has_many :tasks, dependent: :destroy

  # name and position attributes, position greater or equal to 0
  validates :name, presence: true
  validates :position, numericality: { greater_than_or_equal_to: 0 }
end
