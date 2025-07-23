
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');


let messages = [];


document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadInitialMessages();
    scrollToBottom();
});


function setupEventListeners() {

    sendBtn.addEventListener('click', sendMessage);


    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });


    messageInput.addEventListener('input', function() {
        sendBtn.disabled = this.value.trim() === '';
    });


    sendBtn.disabled = true;
}


function loadInitialMessages() {
    const existingMessages = messagesContainer.querySelectorAll('.message');
    existingMessages.forEach((msgElement, index) => {
        const isReceived = msgElement.classList.contains('received');
        const content = msgElement.querySelector('p').textContent;
        const timestamp = msgElement.querySelector('.timestamp').textContent;

        messages.push({
            id: index + 1,
            content: content,
            type: isReceived ? 'received' : 'sent',
            timestamp: timestamp
        });
    });
}


function sendMessage() {
    const content = messageInput.value.trim();

    if (content === '') return;


    const message = {
        id: messages.length + 1,
        content: content,
        type: 'sent',
        timestamp: getCurrentTime()
    };


    messages.push(message);


    const messageElement = createMessageElement(message);
    messagesContainer.appendChild(messageElement);

    messageInput.value = '';
    sendBtn.disabled = true;


    scrollToBottom();


    setTimeout(simulateReply, 2000 + Math.random() * 3000);
}


function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.type} new`;

    let html = '';

    if (message.type === 'received') {
        html = `
            <img src="https://via.placeholder.com/32" alt="User" class="message-avatar">
            <div class="message-content">
                <p>${message.content}</p>
                <span class="timestamp">${message.timestamp}</span>
            </div>
        `;
    } else {
        html = `
            <div class="message-content">
                <p>${message.content}</p>
                <span class="timestamp">${message.timestamp}</span>
            </div>
        `;
    }

    messageDiv.innerHTML = html;
    return messageDiv;
}


function simulateReply() {
    const replies = [
        "Thanks for the message!",
        "Sure, that sounds good.",
        "I'll confirm the details with you.",
        "Great! See you then.",
        "Let me check and get back to you.",
        "Perfect timing!",
        "That works for me.",
        "I'll send you the location details.",
        "Looking forward to the trip!",
        "Thanks for choosing our carpool!"
    ];

    const randomReply = replies[Math.floor(Math.random() * replies.length)];

    const replyMessage = {
        id: messages.length + 1,
        content: randomReply,
        type: 'received',
        timestamp: getCurrentTime()
    };

    messages.push(replyMessage);

    const messageElement = createMessageElement(replyMessage);
    messagesContainer.appendChild(messageElement);

    scrollToBottom();
}


function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutes} ${ampm}`;
}


function scrollToBottom() {
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
}


function goBack() {

    alert('Going back to previous page...');
    // window.history.back();
}


function searchMessages(query) {
    const filteredMessages = messages.filter(message =>
        message.content.toLowerCase().includes(query.toLowerCase())
    );
    return filteredMessages;
}

function markAsRead() {

    console.log('Messages marked as read');
}


function deleteMessage(messageId) {
    messages = messages.filter(message => message.id !== messageId);
    renderMessages();
}


function renderMessages(messagesToRender = messages) {
    messagesContainer.innerHTML = '';

    messagesToRender.forEach(message => {
        const messageElement = createMessageElement(message);
        messagesContainer.appendChild(messageElement);
    });

    scrollToBottom();
}


document.querySelector('.attach-btn').addEventListener('click', function() {
    alert('File attachment feature coming soon!');

});


window.CarPoolMessaging = {
    sendMessage,
    searchMessages,
    markAsRead,
    deleteMessage,
    renderMessages,
    messages
};