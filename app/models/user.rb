class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
         
  belongs_to :plan
  
  attr_accessor :stripeToken
  def save_with_subscription
    if valid?
      customer = Stripe::Customer.create(
        :email => email,
        :source => stripeToken,
      )
      Stripe::Subscription.create(
        :customer => customer.id,
        :plan => plan_id,
      )
      self.stripe_customer_token = customer.id
      save!
    end
  end
end
