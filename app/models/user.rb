class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
         
  belongs_to :plan
  has_one :profile
  
  attr_accessor :stripeToken
  
  # If pro user passes validations
  # then call call Stripe and tell Stripe to set up a subscription
  # upon charging the user's credit card
  # Stripe responds back with customer data
  # and we store customer id as the customer token
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
