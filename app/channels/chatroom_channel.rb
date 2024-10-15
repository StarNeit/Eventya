class ChatroomChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from "chatroom_#{params[:chatroom_id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def send_message(data)
    message = @chatroom.message.new(content: data['content'], user: current_user)

    if data['media'].present?
      begin
        puts "Media present....."
        # Assume media is sent as a URL or base64 string
        # Handling file uploads via Action Cable can be complex
        # It's recommended to handle file uploads via standard HTTP requests
        # and broadcast the message after saving
      rescue => e
        # Handle errors
      end
    end

    if message.save
      ActionCable.server.broadcast "chatroom_#{@chatroom.id}", message: render_message(message)
    end
  end

  def render_message(message)
    ApplicationController.renderer.render(partial: 'message/message', locals: { message: message })
  end

  def find_chatroom
    @chatroom = Chatroom.find(params[:chatroom_id])
  end
end
