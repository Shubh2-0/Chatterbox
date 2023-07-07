package com.masai.configration;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.masai.model.ChatMessage;
import com.masai.model.MessageType;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

	
	private final SimpMessageSendingOperations messageTemplates;
	 
	
	
	/**
	 * Event listener method for handling WebSocket session disconnect events.
	 * It retrieves the username from the session attributes and sends a leave message to the chat.
	 * 
	 * @param event The {@link org.springframework.web.socket.messaging.SessionDisconnectEvent SessionDisconnectEvent}
	 *              triggered when a WebSocket session is disconnected.
	 */
	@EventListener
	public void handlerWebSocketDisconnetListener(SessionDisconnectEvent event) {
		
		
	StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
	
	String username = (String) headerAccessor.getSessionAttributes().get("username");
	
	if(username != null) {
		log.info("User disconnected: {}",username);
		var chatMessage = ChatMessage.builder()
				.type(MessageType.LEAVE)
		        .sender(username)
		        .build();
		
		messageTemplates.convertAndSend("/topic/public",chatMessage);
		
	}
	
		
	}
	
}
