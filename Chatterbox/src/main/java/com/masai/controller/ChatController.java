package com.masai.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.masai.model.ChatMessage;

@Controller
public class ChatController {

	/**
	 * Handles the "/chat.sendMessage" message mapping. Sends the received chat
	 * message to the "/topic/public" destination.
	 *
	 * @param chatMessage The chat message payload received from the client.
	 * @return The same chat message that was received.
	 */
	@MessageMapping("/chat.sendMessage")
	@SendTo("/topic/public")
	public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {

		return chatMessage;

	}

	/**
	 * Handles the "/chat.addUser" message mapping. Adds the user to the chat by
	 * setting the username in the session attributes of the WebSocket connection.
	 * Sends the received chat message to the "/topic/public" destination.
	 *
	 * @param chatMessage               The chat message payload received from the
	 *                                  client.
	 * @param simpMessageHeaderAccessor The SimpMessageHeaderAccessor for accessing
	 *                                  the WebSocket session attributes.
	 * @return The same chat message that was received.
	 */
	@MessageMapping("/chat.addUser")
	@SendTo("/topic/public")
	public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor simpMessageHeaderAccessor) {

		simpMessageHeaderAccessor.getSessionAttributes().put("username", chatMessage.getSender());

		return chatMessage;

	}

}
