package com.sneakerhub.config;

import com.sneakerhub.security.JwtAuthenticationFilter;
import com.sneakerhub.security.CustomUserDetailsService;
import com.sneakerhub.security.OAuth2AuthenticationSuccessHandler;
import com.sneakerhub.security.OAuth2AuthenticationFailureHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Security Configuration - Configures Spring Security with JWT and OAuth2
 * authentication
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    @Autowired
    private OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;

    /**
     * Password encoder bean
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Authentication provider
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Authentication manager bean
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    /**
     * Security filter chain configuration
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF (not needed for stateless JWT)
                .csrf(csrf -> csrf.disable())

                // Enable CORS
                .cors(cors -> cors.configure(http))

                // Session management - stateless
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Authorization rules
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/public/**").permitAll()

                        // OAuth2 endpoints
                        .requestMatchers("/oauth2/**").permitAll()
                        .requestMatchers("/login/oauth2/**").permitAll()

                        // Swagger/OpenAPI endpoints
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/api-docs/**").permitAll()

                        // Actuator endpoints
                        .requestMatchers("/actuator/**").permitAll()

                        // Public read-only endpoints for sneakers
                        .requestMatchers(HttpMethod.GET, "/api/sneakers", "/api/sneakers/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products", "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories", "/api/categories/**").permitAll()

                        // User endpoints - require USER role
                        .requestMatchers("/api/cart/**").hasAnyRole("USER", "OWNER", "ADMIN")
                        .requestMatchers("/api/orders/**").hasAnyRole("USER", "OWNER", "ADMIN")
                        .requestMatchers("/api/profile/**").hasAnyRole("USER", "OWNER", "ADMIN")

                        // Owner endpoints - require OWNER role
                        .requestMatchers(HttpMethod.POST, "/api/sneakers/**").hasAnyRole("OWNER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/sneakers/**").hasAnyRole("OWNER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/sneakers/**").hasAnyRole("OWNER", "ADMIN")

                        // Admin endpoints - require ADMIN role
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/users/**").hasRole("ADMIN")

                        // All other requests require authentication
                        .anyRequest().authenticated())

                // OAuth2 Login Configuration
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oAuth2AuthenticationSuccessHandler)
                        .failureHandler(oAuth2AuthenticationFailureHandler))

                // Add JWT filter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
