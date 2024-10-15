class MessagesController < ApplicationController
  # CHECK
  # before_action :set_message, only: %i[ show edit update destroy ]
  before_action :authenticate_user!
  before_action :set_chatroom


  # GET /messages or /messages.json
  def index
    @messages = Message.all
  end

  # GET /messages/1 or /messages/1.json
  def show
  end

  # GET /messages/new
  def new
    @message = Message.new
  end

  # GET /messages/1/edit
  def edit
  end

  #POST /chatrooms/:chatroom_id/messages
  def create 
    puts "PARAMS -- " + params.inspect + " - MESSAGES - " + current_user.inspect
    puts "Request format: #{request.format}"  # Debug the request format

    @message = @chatroom.messages.new(message_params)
    @message.user = current_user

    if params[:attachments].present?
      params[:attachments].each do |key, attachment|
        @message.attachments.attach(attachment) # Ensure attachment is linked to the message
      end
    end

    respond_to do |format|
      format.json do

        if @message.save
          # Use the `render_to_string` method to render the message partial
          message_html = render_to_string(partial: "messages/message", locals: { message: @message })

          message_data = {
            id: @message.id,
            content: @message.content,
            created_at: @message.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            attachments: @message.attachments.map do |attachment|
              {
                url: url_for(attachment),
                type: attachment.content_type.split('/').first,
                filename: attachment.filename.to_s
              }
            end
          }

          ActionCable.server.broadcast("chatroom_#{@chatroom.id}", { 
            message_html: message_data,
            user: {
              id: current_user.id,
              email: current_user.email,
              # name: current_user.name,  # Assuming there's a 'name' attribute
              avatar_url: view_context.gravatar_url(current_user.email) # Use gravatar as a fallback
            }
          })
        
          puts "MESSAGE SAVE --- *** #{@message.inspect}"
          render json: {
            message: message_data,
            user: {
              id: current_user.id,
              email: current_user.email,
              # name: current_user.name, # Assuming there's a 'name' attribute
              avatar_url: view_context.gravatar_url(current_user.email) # Use gravatar helper
            }
          }, status: :ok
          # render json: { message: @message, user: current_user}, status: :ok
        else
          puts "MESSAGE SAVE ERROR: " + @message.errors.full_messages.to_sentence 

          flash[:alert] = "Message could not be sent. Please check authentication"
          render json: { error: @message.errors.full_messages }, status: :unprocessable_entity
        end
      end  
    end
  end


  # PATCH/PUT /messages/1 or /messages/1.json
  def update
    respond_to do |format|
      if @message.update(message_params)
        format.html { redirect_to @message, notice: "Message was successfully updated." }
        format.json { render :show, status: :ok, location: @message }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @message.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /messages/1 or /messages/1.json
  def destroy
    @message.destroy

    respond_to do |format|
      format.html { redirect_to messages_path, status: :see_other, notice: "Message was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

    def set_chatroom
      @chatroom = Chatroom.find_by(id: params[:chatroom_id])
    end

    def message_params 
      params.permit(:content, :user_id, :chatroom_id, attachments: [])
    end

    def render_message(message)
      ApplicationController.renderer.render(partial: "messages/message", locals: {message: message})
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_message
      @message = Message.find_by(id: params[:id])
    end

    # Only allow a list of trusted parameters through.
    # def message_params
    #   params.require(:message).permit(:content, :user_id, :chatroom_id, :media)
    # end
end
 