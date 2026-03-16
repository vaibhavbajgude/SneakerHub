package com.sneakerhub.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

/**
 * OAuth2 Failure Handler - Handles failed OAuth2 authentication
 */
@Component
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    private static final Logger logger = LoggerFactory.getLogger(OAuth2AuthenticationFailureHandler.class);

    @Value("${app.oauth2.redirect-uri:http://localhost:8080/oauth2/redirect}")
    private String redirectUri;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException exception) throws IOException, ServletException {

        logger.error("OAuth2 authentication failed: {}", exception.getMessage());

        String finalRedirectUri = (redirectUri != null) ? redirectUri : "http://localhost:5173/oauth2/redirect";
        String errorMessage = (exception.getLocalizedMessage() != null) ? exception.getLocalizedMessage()
                : "Authentication failed";

        String result = UriComponentsBuilder.fromUriString(finalRedirectUri)
                .queryParam("error", errorMessage)
                .build()
                .toUriString();

        String targetUrl = (result != null) ? result : finalRedirectUri;

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
