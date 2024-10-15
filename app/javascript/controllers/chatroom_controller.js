import { Controller } from "@hotwired/stimulus"
import consumer from "../channels/consumer"


export default class extends Controller{
    static targets = ["messages", "input", "form", "fileInput", "attachFileBtn", "fileCount", "fileCountCont"];

    connect(){
        console.log("Chatroom controller connected");

        this.fileCountTarget.style.display = 'none';
        // this.chatroomId = this.data.get("chatroom-id")
        this.chatroomId = this.element.dataset.chatroomId;

        console.log({GET_CHATROOMID: this.chatroomId});

        if (!this.chatroomId) {
            console.error("Chatroom ID not found");
            return;
        }
        
        this.channel = consumer.subscriptions.create(
            { channel: "ChatroomChannel", chatroom_id: this.chatroomId },
            {
                received: (data) => {   
                    
                    console.log("\n \n Received data::: ", {userData: data.user}, {content: data.message_html}, {data});
                    this.insertMessageAndScroll(data.message_html, data.user);
                },
                send_message: (message, attachments) => {
                    this.perform("send_message", {content: message, media: attachments })
                }
            }
        )
    }

    // Updated to handle message JSON data and insert it dynamically
    insertMessageAndScroll(messageData, userData) {
        
        // Destructure message data
        // const msgJson = JSON.parse(messageData)
        const { content, attachments, created_at } = messageData;
        const { email, avatar_url} = userData

        // Create the HTML structure dynamically using JavaScript
        const messageElement = document.createElement('div');
        messageElement.classList.add('flex', 'items-start', 'mb-4');

        messageElement.innerHTML = `
          <div class="flex-shrink-0">
            <img class="h-10 w-10 rounded-full" src="${avatar_url}" alt="${avatar_url}">
          </div>
          <div class="ml-4">
            <div class="text-sm font-semibold text-gray-900">${email}</div>
            <div class="text-sm text-gray-700">${content}</div>
            <div class="mt-2">${this.renderAttachments(attachments)}</div>
            <div class="text-xs text-gray-500 mt-1">${created_at} ago</div>
          </div>
        `;

        // Append the message element to the messages container
        this.messagesTarget.appendChild(messageElement);

        // Automatically scroll to the bottom of the message container
        this.messagesTarget.scrollTop = this.messagesTarget.scrollHeight;
    }

    // Helper function to render attachments dynamically
    renderAttachments(attachments) {
        console.log({attachments});
        
        if (!attachments.length) return '';

        return attachments.map(attachment => {
            console.log({attachment});
            
            if (attachment.type === 'image') {
                return `<img src="${attachment.url}" class="rounded" />`;
            } else if (attachment.type === 'video') {
                return `<video src="${attachment.url}" controls class="rounded"></video>`;
            } else {
                return `<a href="${attachment.url}" class="text-blue-500 hover:underline">${attachment.filename}</a>`;
            }
        }).join('');
    }

    // Helper to generate gravatar URL
    gravatarUrl(email, size = 40) {
        console.log({email});
        const hash = md5(email.toString().toLowerCase());
        return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
    }

    attachFile(event){
        // event.preventDefault();
        console.log("attachFile method called"); // Add this line
        this.fileInputTarget.click();
    }

    updateFileCount(event){
        console.log({ event });

        const files = event.target.files;
        const fileCount = files.length;

        if (fileCount > 0) {
            this.fileCountTarget.innerText = `${fileCount}`
            this.fileCountTarget.style.display = 'flex'; // Show when files exist
        } else {
            this.fileCountTarget.style.display = 'none';
        }
    }

    async send(event){
        event.preventDefault();

        const message = this.inputTarget.value.trim();
        const files = this.fileInputTarget.files;
    
        if (message === "" && files.length === 0) {
          return;  // Do nothing if no message and no files
        }
    
        // Create FormData to handle file uploads
        const formData = new FormData();
        formData.append("content", message);
    
        if (files.length > 0) {
          Array.from(files).forEach((file, index) => {
            formData.append(`attachments[${index}]`, file);  // Attach files to formData
          });
        }
    
        // Send the message and files
        this.sendMessageToServer(formData);
    
        // Reset form fields after sending the message
        this.inputTarget.value = "";
        this.fileInputTarget.value = "";
        this.fileCountTarget.style.display = 'none';
    }

    sendMessageToServer(formData) {
        const form = this.formTarget

        // Get the chatroom_id from the URL's query parameters
        const chatroomId = form.action.split('/').pop()
      
    
        // Perform the ActionCable send_message with form data
        console.log({TOKENN: document.querySelector("[name='csrf-token']").content, URL: form.action});
        
        fetch(`/chatrooms/${chatroomId}/messages`, {
          method: "POST",
          body: formData,
          headers: {
            "X-CSRF-Token": document.querySelector("[name='csrf-token']").content,
            "Accept": "application/json"  // Specify JSON response format
          }
        })
        .then(response => response.json())
        .then(data => {
          console.log("Message sent", data);
        //   this.channel.perform("send_message", { message: data.message });
        })
        .catch(error => console.error("Error:", error));
    }
}