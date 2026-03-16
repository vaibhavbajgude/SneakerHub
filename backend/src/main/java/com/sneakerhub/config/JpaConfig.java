package com.sneakerhub.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * JPA Configuration - Enables JPA Auditing for @CreatedDate
 * and @LastModifiedDate
 */
@Configuration
@EnableJpaAuditing
public class JpaConfig {
    // This enables automatic population of @CreatedDate and @LastModifiedDate
    // fields
}
