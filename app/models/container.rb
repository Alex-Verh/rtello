class Container < ApplicationRecord
  enum :container_type, [ :dashboard, :template ]

  # Associations
  belongs_to :user
  has_one :dashboard, dependent: :destroy
  has_one :template, dependent: :destroy
  has_many :lists, dependent: :destroy

  # name and type attributes
  validates :name, :container_type, presence: true
end
