class Template < ApplicationRecord
  # Associations
  belongs_to :container

  # usage_count attribute should be greater or equal to 0
  validates :usage_count, numericality: { greater_than_or_equal_to: 0 }
end
