class AddChatroomIdToMessages < ActiveRecord::Migration[7.0]
  def change
    add_column :messages, :chatroom_id, :integer
  end
end
