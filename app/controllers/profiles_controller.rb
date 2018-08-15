class ProfilesController < ApplicationController
  before_action :authenticate_user!
  before_action :only_current_user
  before_action :set_s3_direct_post, only: [:new, :edit, :create, :update]

  
  # user makes GET request to /users/:user_id/profile/new
  def new
    @profile = Profile.new
  end
  
  # user makes a POST request to /user/:user_id/profile/
  def create
    @user = User.find(params[:user_id])
    @profile = @user.build_profile(profile_params)
    
    if @profile.save!
      flash[:success] = "Profile updated."
      redirect_to user_path(id: params[:user_id])
    else
      render action: :new
    end
  end
  
  def edit
    @user = User.find(params[:user_id])
    @profile = @user.profile
  end
  
  def update
    @user = User.find(params[:user_id])
    @profile = @user.profile
    
    if @profile.update_attributes(profile_params)
      flash[:success] = "Profile has been updated."
      # Redirect user to their profile page
      redirect_to user_path(id: params[:user_id])
    else
      render action: :edit
    end
  end
  
  
  private
    def profile_params
      params.require(:profile).permit(
                                        :first_name,
                                        :last_name,
                                        :avatar_url,
                                        :job_title,
                                        :phone_number,
                                        :contact_email,
                                        :description
                                      )
    end
    
    def only_current_user
      @user = User.find(params[:user_id])
      redirect_to(root_path) unless @user == current_user
    end
    
    def set_s3_direct_post
     @s3_direct_post = S3_BUCKET.presigned_post(
                                                  key: "uploads/#{SecureRandom.uuid}/${filename}",
                                                  success_action_status: '201',
                                                  acl: 'public-read',
                                                  content_type_starts_with: 'image/'
                                                )
    end
    
end