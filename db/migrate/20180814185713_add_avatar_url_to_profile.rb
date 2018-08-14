class AddAvatarUrlToProfile < ActiveRecord::Migration[5.0]
  def change
    add_column :profiles, :avatar_url, :string
  end
end
