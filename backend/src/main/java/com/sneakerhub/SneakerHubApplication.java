package com.sneakerhub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;
import com.sneakerhub.model.Role;
import com.sneakerhub.model.User;
import com.sneakerhub.model.Cart;
import com.sneakerhub.repository.UserRepository;
import com.sneakerhub.repository.CartRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;

/**
 * Main Application Class for SneakerHub E-Commerce Platform
 * 
 * @author SneakerHub Team
 * @version 1.0.0
 */
@SpringBootApplication
@org.springframework.scheduling.annotation.EnableAsync
public class SneakerHubApplication {

    public static void main(String[] args) {
        System.out.println("🔍 Searching for .env file...");

        // Try multiple common locations for .env
        String[] paths = { "./", "./backend/", "../" };
        Dotenv dotenv = null;

        for (String path : paths) {
            try {
                Dotenv d = Dotenv.configure()
                        .directory(path)
                        .ignoreIfMissing()
                        .load();
                if (!d.entries().isEmpty()) {
                    dotenv = d;
                    System.out.println("✅ Found and loaded .env from: " + path);
                    break;
                }
            } catch (Exception e) {
                // Continue to next path
            }
        }

        if (dotenv != null) {
            dotenv.entries().forEach(entry -> {
                String key = entry.getKey();
                String value = entry.getValue();

                // Set as-is
                if (System.getProperty(key) == null) {
                    System.setProperty(key, value);
                }

                // Specialized mapping for Spring Profiles
                if (key.equalsIgnoreCase("SPRING_PROFILE") || key.equalsIgnoreCase("SPRING_PROFILES_ACTIVE")) {
                    System.setProperty("spring.profiles.active", value);
                }
            });

            System.out.println("🌱 Active Profile: " + System.getProperty("spring.profiles.active", "default"));

            // Debug check for Google Client ID (Masked)
            String googleId = System.getProperty("GOOGLE_CLIENT_ID");

            if (googleId == null) {
                // Try to get from default if profile didn't load yet (though it should)
                googleId = dotenv.get("GOOGLE_CLIENT_ID");
            }
            if (googleId != null && !googleId.equals("google-client-id")) {
                String masked = googleId.substring(0, 10) + "..." + googleId.substring(googleId.length() - 5);
                System.out.println("✨ Google Client ID Loaded: " + masked);
            } else {
                System.err.println("⚠️ Warning: GOOGLE_CLIENT_ID not found in .env or is still default!");
            }
        } else {
            System.err.println("❌ Error: Could not find a valid .env file in search paths!");
        }

        SpringApplication.run(SneakerHubApplication.class, args);
        System.out.println("\n" +
                "╔═══════════════════════════════════════════════════════╗\n" +
                "║                                                       ║\n" +
                "║     🚀 SneakerHub Backend Started Successfully! 🚀   ║\n" +
                "║                                                       ║\n" +
                "║     API: http://localhost:8080/api                    ║\n" +
                "║     Swagger UI: http://localhost:8080/swagger-ui.html ║\n" +
                "║                                                       ║\n" +
                "╚═══════════════════════════════════════════════════════╝\n");
    }

    /**
     * Seed default data and clean up existing variants
     */
    @Bean
    public CommandLineRunner seedData(UserRepository userRepository, CartRepository cartRepository,
            com.sneakerhub.repository.SneakerRepository sneakerRepository,
            com.sneakerhub.repository.SneakerVariantRepository variantRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. Admin User
            String adminEmail = "admin@sneakerhub.com";
            User admin = userRepository.findByEmail(adminEmail).orElse(null);

            if (admin == null) {
                System.out.println("👤 Creating default admin user...");
                admin = User.builder()
                        .email(adminEmail)
                        .password(passwordEncoder.encode("admin123"))
                        .firstName("System")
                        .lastName("Admin")
                        .role(Role.ADMIN)
                        .provider(User.AuthProvider.LOCAL)
                        .enabled(true)
                        .accountNonExpired(true)
                        .accountNonLocked(true)
                        .credentialsNonExpired(true)
                        .build();

                User savedAdmin = userRepository.save(admin);
                cartRepository.save(Cart.builder().user(savedAdmin).build());
                System.out.println("✅ Admin user created: " + adminEmail);
            } else {
                System.out.println("👤 Admin user exists.");
                admin.setPassword(passwordEncoder.encode("admin123"));
                userRepository.save(admin);
            }

            // 2. Data Migration: Convert "Free Size" to numerical sizes
            System.out.println("🔄 Checking for 'Free Size' variants to migrate...");
            List<com.sneakerhub.model.SneakerVariant> freeSizeVariants = variantRepository.findAll().stream()
                    .filter(v -> "Free Size".equalsIgnoreCase(v.getSize()))
                    .collect(java.util.stream.Collectors.toList());

            if (!freeSizeVariants.isEmpty()) {
                System.out.println(
                        "📦 Found " + freeSizeVariants.size() + " 'Free Size' variants. Migrating to UK 6, 7, 8, 9...");
                for (com.sneakerhub.model.SneakerVariant oldVariant : freeSizeVariants) {
                    com.sneakerhub.model.Sneaker sneaker = oldVariant.getSneaker();
                    int totalStock = oldVariant.getStockQuantity();
                    int stockPerSize = totalStock / 4;

                    String[] newSizes = { "6", "7", "8", "9" };
                    for (String size : newSizes) {
                        if (!variantRepository.existsBySneakerIdAndSizeAndColorVariant(sneaker.getId(), size,
                                oldVariant.getColorVariant())) {
                            com.sneakerhub.model.SneakerVariant newVariant = com.sneakerhub.model.SneakerVariant
                                    .builder()
                                    .sneaker(sneaker)
                                    .size(size)
                                    .colorVariant(oldVariant.getColorVariant())
                                    .stockQuantity(stockPerSize > 0 ? stockPerSize : 5)
                                    .price(oldVariant.getPrice())
                                    .discountPrice(oldVariant.getDiscountPrice())
                                    .available(true)
                                    .sku("MIG-" + sneaker.getId() + "-" + size)
                                    .build();
                            variantRepository.save(newVariant);
                        }
                    }
                    // Instead of deleting, we rename and deactivate the old variant.
                    // This avoids foreign key constraint violations with existing orders.
                    oldVariant.setAvailable(false);
                    oldVariant.setStockQuantity(0);
                    oldVariant.setSize("Free Size (Legacy)");
                    variantRepository.save(oldVariant);
                }
                System.out.println("✅ Migration complete.");
            }
        };
    }

}
