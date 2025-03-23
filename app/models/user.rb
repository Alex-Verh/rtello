class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :omniauthable, omniauth_providers: [ :google_oauth2 ]


  # Associations
  has_many :containers, dependent: :destroy
  has_many :members, dependent: :destroy
  has_many :dashboards, through: :members

  # first and last name for the user model
  validates :first_name, :last_name, presence: true

  def full_name
    "#{first_name} #{last_name}"
  end

  def self.from_omniauth(auth)
    user = User.find_by(email: auth.info.email.downcase)
    if user
      # add google auth details if user previously manually registered
      if !user.confirmed?
        user.skip_confirmation!
        user.save!
      end
      user.update(provider: auth.provider, uid: auth.uid) unless user.provider.present? && user.uid.present?
    else
      user = User.new(
        email: auth.info.email.downcase,
        first_name: auth.info.first_name,
        last_name: auth.info.last_name.presence || "Rtello",
        password: Devise.friendly_token[0, 20],
        provider: auth.provider,
        uid: auth.uid
      )

      user.skip_confirmation!
      user.save!
    end

    user
  end
end
