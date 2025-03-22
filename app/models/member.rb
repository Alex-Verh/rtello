class Member < ApplicationRecord
  # Associations
  belongs_to :dashboard
  belongs_to :user

  # check the same user to not be added multiple time to same dashboard
  validates :dashboard_id, uniqueness: { scope: :user_id }
end
