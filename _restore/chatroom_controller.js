import { Controller } from "@hotwired/stimulus"
import consumer from "../channels/consumer"

export default class extends Controller{
    static targets = ["messages", "input", "form", "fileInput", "attachFileBtn", "fileCount", "fileCountCont"];

    greet() {
        console.log("HELLO---");
    }

    connect(){
        console.log("Chatroom controller connected");
        console.log(this.fileInputTarget); // Should log the file input element

        this.classroomId = this.data.get("chatroomId")
        this.channel = consumer.subscriptions.create(
            { channel: "ChatroomChannel", chatroom_id: this.classroomId },
            {
                received: (data) => {
                    this.messagesTarget.insertAdjacentHTML('beforehand', data.message)
                    this.messagesTarget.scrollTop = this.messagesTarget.scrollHeight
                    this.inputTarget.value = ""
                },
                send_message: (message) => {
                    this.perform("send_message", {content: message})
                }
            }
        )
    }

    attachFile(event){
        // event.preventDefault();
        console.log("attachFile method called"); // Add this line
        this.fileInputTarget.click();
    }

    updateFileCount(event){
        console.log({event});
        
        const files = event.target.files;
        const fileCount = files.length;

        if(fileCount > 0){
            this.fileCountTarget.innerText = `${fileCount}`
            this.fileCountTarget.hidden = false;
        } else {
            this.fileCountTarget.hidden = true;
        }
    }

    sendMessage(event){
        event.preventDefault();
        const form = this.formTarget
        const formData = new FormData(form)

        fetch(form.action, {
            method: POST,
            headers: {
                'Accept': 'application/json',
                'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: formData,
        })
        .then(res => {
            if(res.ok){
                console.log("Message sent successfully.....");
                
            } else {
                alert("Failed to send message.")
            }
        })
        .catch(error => {
            console.error("Error:", error)
            alert("An error occurred while sending the message.")
        })
    }

    send(event){
        event.preventDefault();
        const message = this.inputTarget.value.trim()
        if (message !== ""){
            this.channel.send_message(message);
        }
    }
}