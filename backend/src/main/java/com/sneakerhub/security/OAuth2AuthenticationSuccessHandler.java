package com.sneakerhub.security;

import com.sneakerhub.model.Cart;
import com.sneakerhub.model.Role;
import com.sneakerhub.model.User;
import com.sneakerhub.repository.CartRepository;
import com.sneakerhub.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

/**
 * OAuth2 Success Handler - Handles successful OAuth2 authentication
 * Creates user if not exists and generates JWT token
 */
@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private static final Logger logger = LoggerFactory.getLogger(OAuth2AuthenticationSuccessHandler.class);

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Value("${app.oauth2.redirect-uri:http://localhost:8080/oauth2/redirect}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        String targetUrl = determineTargetUrl(request, response, authentication);

        if (response.isCommitted()) {
            logger.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    protected String determineTargetUrl(HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) {

        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = oauthToken.getPrincipal();

        // Extract user info from OAuth2 provider
        Map<String, Object> attributes = oAuth2User.getAttributes();
        OAuth2UserInfo userInfo = new OAuth2UserInfo(attributes);

        // Get or create user
        User user = processOAuth2User(userInfo);

        // Generate JWT tokens
        String accessToken = tokenProvider.generateTokenFromUsername(user.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        // Build redirect URL with tokens
        String finalRedirectUri = (redirectUri != null) ? redirectUri : "http://localhost:8080/oauth2/redirect";

        String result = UriComponentsBuilder.fromUriString(finalRedirectUri)
                .queryParam("token", accessToken)
                .queryParam("refreshToken", refreshToken)
                .queryParam("userId", user.getId())
                .queryParam("email", user.getEmail())
                .queryParam("firstName", user.getFirstName())
                .queryParam("lastName", user.getLastName())
                .queryParam("role", user.getRole())
                .build()
                .toUriString();

        return (result != null) ? result : finalRedirectUri;
    }

    /**
     * Get existing user or create new user from OAuth2 info
     */
    private User processOAuth2User(OAuth2UserInfo userInfo) {
        // Try to find user by email
        Optional<User> userOptional = userRepository.findByEmail(userInfo.getEmail());

        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();

            // Update user info if changed
            boolean updated = false;

            if (!user.getProvider().equals(User.AuthProvider.GOOGLE)) {
                user.setProvider(User.AuthProvider.GOOGLE);
                user.setProviderId(userInfo.getId());
                updated = true;
            }

            if (user.getProviderId() == null || !user.getProviderId().equals(userInfo.getId())) {
                user.setProviderId(userInfo.getId());
                updated = true;
            }

            if (updated) {
                @SuppressWarnings("null")
                User savedUser = userRepository.save(user);
                user = savedUser;
            }

            logger.info("Existing user logged in via Google: {}", user.getEmail());
        } else {
            // Create new user
            user = User.builder()
                    .email(userInfo.getEmail())
                    .password("") // No password for OAuth users
                    .firstName(userInfo.getFirstName())
                    .lastName(userInfo.getLastName())
                    .role(Role.USER) // Default role
                    .provider(User.AuthProvider.GOOGLE)
                    .providerId(userInfo.getId())
                    .enabled(true)
                    .accountNonExpired(true)
                    .accountNonLocked(true)
                    .credentialsNonExpired(true)
                    .build();

            @SuppressWarnings("null")
            User savedUser = userRepository.save(user);
            user = savedUser;

            // Create cart for new user
            Cart cart = Cart.builder()
                    .user(user)
                    .build();
            @SuppressWarnings({ "null", "unused" })
            Cart savedCart = cartRepository.save(cart);

            logger.info("New user created via Google OAuth2: {}", user.getEmail());
        }

        return user;
    }
}
