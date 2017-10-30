class ProfilesController < ApplicationController
  
  # user makes GET request to /users/:user_id/profile/new
  def new
    @profile = Profile.new
  end
end