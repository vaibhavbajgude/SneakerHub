package com.sneakerhub.security;

import lombok.Getter;

import java.util.Map;

/**
 * OAuth2 User Info - Extracts user information from OAuth2 providers
 */
@Getter
public class OAuth2UserInfo {

    private final Map<String, Object> attributes;
    private final String id;
    private final String email;
    private final String firstName;
    private final String lastName;
    private final String imageUrl;

    public OAuth2UserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;

        // Google OAuth2 attributes
        this.id = (String) attributes.get("sub");
        this.email = (String) attributes.get("email");

        // Extract name
        String name = (String) attributes.get("name");
        String tempFirstName = "";
        String tempLastName = "";

        if (name != null && name.contains(" ")) {
            String[] nameParts = name.split(" ", 2);
            tempFirstName = nameParts[0];
            tempLastName = nameParts.length > 1 ? nameParts[1] : "";
        } else {
            tempFirstName = name != null ? name : "";
            tempLastName = "";
        }

        // Also try given_name and family_name if available
        String givenName = (String) attributes.get("given_name");
        String familyName = (String) attributes.get("family_name");

        if (givenName != null) {
            tempFirstName = givenName;
        }
        if (familyName != null) {
            tempLastName = familyName;
        }

        this.firstName = tempFirstName;
        this.lastName = tempLastName;

        this.imageUrl = (String) attributes.get("picture");
    }

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
