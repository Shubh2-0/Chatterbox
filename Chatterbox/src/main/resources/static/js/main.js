"use strict";

var usernamePage = document.querySelector("#username-page");
var chatPage = document.querySelector("#chat-page");
var usernameForm = document.querySelector("#usernameForm");
var messageForm = document.querySelector("#messageForm");
var messageInput = document.querySelector("#message");
var messageArea = document.querySelector("#messageArea");
var connectingElement = document.querySelector(".connecting");

var stompClient = null;
var username = null;

var colors = [
  "#2196F3",
  "#32c787",
  "#00BCD4",
  "#ff5652",
  "#ffc107",
  "#ff85af",
  "#FF9800",
  "#39bbb0",
];

("use strict");

var usernamePage = document.querySelector("#username-page");
var chatPage = document.querySelector("#chat-page");
var usernameForm = document.querySelector("#usernameForm");
var messageForm = document.querySelector("#messageForm");
var messageInput = document.querySelector("#message");
var messageArea = document.querySelector("#messageArea");
var connectingElement = document.querySelector(".connecting");

var stompClient = null;
var username = null;

var colors = [
  "#2196F3",
  "#32c787",
  "#00BCD4",
  "#ff5652",
  "#ffc107",
  "#ff85af",
  "#FF9800",
  "#39bbb0",
];

// ================FIRST METHOD======================
/**
 * Connects to the WebSocket server and initializes the chat.
 * @param {Event} event - The submit event triggered by the username form.
 */
function connect(event) {
  // Get the entered username
  username = document.querySelector("#name").value.trim();

  if (username) {
    // Hide the username page and show the chat page
    usernamePage.classList.add("hidden");
    chatPage.classList.remove("hidden");

    // Create a WebSocket connection
    var socket = new SockJS("/ws");
    stompClient = Stomp.over(socket);

    // Connect to the WebSocket server
    stompClient.connect({}, onConnected, onError);
  }
  event.preventDefault();
}

// ================SECOND METHOD======================
/**
 * Callback function executed when the connection is successfully established.
 * Subscribes to the public topic and sends a JOIN message to the server.
 */
function onConnected() {
  // Subscribe to the public topic to receive updates
  stompClient.subscribe("/topic/public", onMessageReceived);

  // Send a JOIN message to the server with the username
  stompClient.send(
    "/app/chat.addUser",
    {},
    JSON.stringify({ sender: username, type: "JOIN" })
  );

  // Hide the connecting message
  connectingElement.classList.add("hidden");
}

// ================THIRD METHOD======================
/**
 * Callback function executed when an error occurs during the WebSocket connection.
 * Updates the connecting element with an error message.
 * @param {any} error - The error object received during the WebSocket connection.
 */
function onError(error) {
  connectingElement.textContent =
    "Uh-oh! It seems that we're having trouble connecting to the WebSocket server. To give it another shot, please refresh the page.";
  connectingElement.style.color = "red";
}

// ================FOURTH METHOD======================
/**
 * Sends a chat message to the server.
 * @param {Event} event - The submit event triggered by the message form.
 */
function sendMessage(event) {
  var messageContent = messageInput.value.trim();
  if (messageContent && stompClient) {
    // Create a chat message object
    var chatMessage = {
      sender: username,
      content: messageInput.value,
      type: "CHAT",
    };

    // Send the chat message to the server
    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));

    // Clear the message input field
    messageInput.value = "";
  }
  event.preventDefault();
}

// ================FIVETH METHOD======================
/**
 * Callback function executed when a new message is received from the server.
 * Renders the received message in the chat area.
 * @param {object} payload - The payload containing the received message.
 */
function onMessageReceived(payload) {
  // Parse the received message from the payload
  var message = JSON.parse(payload.body);

  // Create a new list element to display the message
  var messageElement = document.createElement("li");

  if (message.type === "JOIN") {
    // If the message type is JOIN, add appropriate class and content
    messageElement.classList.add("event-message");
    message.content = message.sender + " joined!";
  } else if (message.type === "LEAVE") {
    // If the message type is LEAVE, add appropriate class and content
    messageElement.classList.add("event-message");
    message.content = message.sender + " left!";
  } else {
    // If the message type is CHAT, add appropriate classes and content
    messageElement.classList.add("chat-message");

    // Create an avatar element with the first character of the sender's name
    var avatarElement = document.createElement("i");
    var avatarText = document.createTextNode(message.sender[0]);
    avatarElement.appendChild(avatarText);
    avatarElement.style["background-color"] = getAvatarColor(message.sender);

    // Append the avatar element to the message element
    messageElement.appendChild(avatarElement);

    // Create a username element with the sender's name
    var usernameElement = document.createElement("span");
    var usernameText = document.createTextNode(message.sender);
    usernameElement.appendChild(usernameText);

    // Append the username element to the message element
    messageElement.appendChild(usernameElement);
  }

  // Create a text element with the message content
  var textElement = document.createElement("p");
  var messageText = document.createTextNode(message.content);
  textElement.appendChild(messageText);

  // Append the text element to the message element
  messageElement.appendChild(textElement);

  // Append the message element to the message area
  messageArea.appendChild(messageElement);

  // Scroll to the bottom of the message area to show the latest message
  messageArea.scrollTop = messageArea.scrollHeight;
}

/**
 * Generates an avatar color based on the characters of the message sender's name.
 * @param {string} messageSender - The name of the message sender.
 * @returns {string} The generated avatar color.
 */
function getAvatarColor(messageSender) {
  // Calculate a hash value based on the message sender's characters
  var hash = 0;
  for (var i = 0; i < messageSender.length; i++) {
    hash = 31 * hash + messageSender.charCodeAt(i);
  }

  // Get the index of the avatar color based on the hash value
  var index = Math.abs(hash % colors.length);

  // Return the avatar color from the colors array
  return colors[index];
}

// Event listeners
usernameForm.addEventListener("submit", connect);
messageForm.addEventListener("submit", sendMessage);

/*
  Explanation of each method:

  - connect(event):
    - Connects to the WebSocket server and initializes the chat.
    - Retrieves the entered username from the input field.
    - Hides the username page and shows the chat page.
    - Creates a WebSocket connection using SockJS.
    - Connects to the WebSocket server using Stomp.
    - Triggers onConnected() on successful connection.
    - Triggers onError() on connection error.
  
  - onConnected():
    - Callback function executed when the connection is successfully established.
    - Subscribes to the public topic to receive chat messages.
    - Sends a JOIN message to the server to identify the user.
    - Hides the connecting element.
  
  - onError(error):
    - Callback function executed when an error occurs during the WebSocket connection.
    - Updates the connecting element with an error message.
    - Accepts the error object as a parameter.
  
  - sendMessage(event):
    - Sends a chat message to the server.
    - Retrieves the message content from the input field.
    - Validates the message content and checks if the WebSocket connection is established.
    - Creates a chat message object with the sender, content, and type.
    - Sends the chat message to the server using Stomp.
    - Clears the message input field.
  
  - onMessageReceived(payload):
    - Callback function executed when a new message is received from the server.
    - Parses the received message from the payload.
    - Creates a new list element to display the message.
    - Checks the message type (JOIN, LEAVE, or CHAT) and adds appropriate classes and content to the message element.
    - If the message type is CHAT, it also creates an avatar element and a username element.
    - Appends the message content and elements to the message element.
    - Appends the message element to the message area.
    - Scrolls to the bottom of the message area to show the latest message.
  
  - getAvatarColor(username):
    - Helper function that generates an avatar color based on the username.
    - Accepts the username as a parameter.
    - Calculates a hash value based on the characters in the username.
    - Uses the hash value to determine the index of the color in the `colors` array.
    - Returns the color corresponding to the calculated index.
  
  Note: Event listeners are attached to the respective form submissions for username and messages.
*/
