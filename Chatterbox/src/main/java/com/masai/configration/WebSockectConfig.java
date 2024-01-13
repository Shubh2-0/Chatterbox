package com.masai.configration;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSockectConfig implements WebSocketMessageBrokerConfigurer {

	/**
	 * Registers the "/ws" endpoint for WebSocket connections. Configures SockJS
	 * fallback options for browsers that do not support WebSocket.
	 *
	 * @param registry The StompEndpointRegistry for registering WebSocket
	 *                 endpoints.
	 */
	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {

		registry.addEndpoint("/ws").withSockJS();

	}

	/**
	 * Configures the message broker for the application. Sets the application
	 * destination prefix to "/app". Enables a simple broker for destinations
	 * prefixed with "/topic".
	 *
	 * @param registry The MessageBrokerRegistry for configuring the message broker.
	 */
	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {

		registry.setApplicationDestinationPrefixes("/app");
		registry.enableSimpleBroker("/topic");

	}

}
