package com.sneakerhub.exception;

import com.sneakerhub.dto.response.ApiResponse;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import org.springframework.security.access.AccessDeniedException;
import java.util.HashMap;
import java.util.Map;

/**
 * Global Exception Handler - Handles all exceptions across the application
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle validation errors
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ApiResponse<Map<String, String>> response = ApiResponse.error("Validation failed", errors);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle resource not found
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {

        ApiResponse<Void> response = ApiResponse.error(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    /**
     * Handle bad request
     */
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadRequestException(
            BadRequestException ex, WebRequest request) {

        ApiResponse<Void> response = ApiResponse.error(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle unauthorized access
     */
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnauthorizedException(
            UnauthorizedException ex, WebRequest request) {

        ApiResponse<Void> response = ApiResponse.error(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Handle access denied
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDeniedException(
            AccessDeniedException ex, WebRequest request) {

        ApiResponse<Void> response = ApiResponse.error("Access denied: " + ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    /**
     * Handle bad credentials
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentialsException(
            BadCredentialsException ex, WebRequest request) {

        ApiResponse<Void> response = ApiResponse.error("Invalid email or password");
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Handle user not found
     */
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleUsernameNotFoundException(
            UsernameNotFoundException ex, WebRequest request) {

        ApiResponse<Void> response = ApiResponse.error(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    /**
     * Handle JWT signature exception
     */
    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<ApiResponse<Void>> handleSignatureException(
            SignatureException ex, WebRequest request) {

        ApiResponse<Void> response = ApiResponse.error("Invalid JWT signature");
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Handle expired JWT
     */
    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ApiResponse<Void>> handleExpiredJwtException(
            ExpiredJwtException ex, WebRequest request) {

        ApiResponse<Void> response = ApiResponse.error("JWT token has expired");
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Handle malformed JWT
     */
    @ExceptionHandler(MalformedJwtException.class)
    public ResponseEntity<ApiResponse<Void>> handleMalformedJwtException(
            MalformedJwtException ex, WebRequest request) {

        ApiResponse<Void> response = ApiResponse.error("Invalid JWT token");
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Handle all other exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGlobalException(
            Exception ex, WebRequest request) {

        ApiResponse<Void> response = ApiResponse
                .error("An unexpected error occurred: " + ex.getClass().getSimpleName());
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
