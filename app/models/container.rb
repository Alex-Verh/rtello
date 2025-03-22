class Container < ApplicationRecord
  enum type: { Dashboard: 0, Template: 1 }

  # Associations
  belongs_to :user
  has_one :dashboard, dependent: :destroy
  has_one :template, dependent: :destroy
  has_many :lists, dependent: :destroy

  # name and type attributes
  validates :name, :type, presence: true
end
