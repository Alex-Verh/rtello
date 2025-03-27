class Dashboard < ApplicationRecord
  # Associations
  belongs_to :container
  has_many :members, dependent: :destroy
  has_many :users, through: :members

  mount_uploader :background_image, DashboardBackgroundUploader # assign uploader for background images

  # background image adn container id attributes
  validates :container_id, presence: true
end
