class Dashboard < ApplicationRecord
  # Associations
  belongs_to :container
  has_many :dashboard_members, dependent: :destroy
  has_many :users, through: :dashboard_members

  # background image adn container id attributes
  validates :container_id, presence: true
end
