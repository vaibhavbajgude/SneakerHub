package com.sneakerhub.repository;

import com.sneakerhub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for User entity
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);

    /**
     * Find user by provider and provider ID (for OAuth)
     */
    Optional<User> findByProviderAndProviderId(User.AuthProvider provider, String providerId);
}
