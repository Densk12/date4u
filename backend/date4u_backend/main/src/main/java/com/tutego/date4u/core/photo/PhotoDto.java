package com.tutego.date4u.core.photo;

import com.fasterxml.jackson.annotation.JsonProperty;

public record PhotoDto(String name, @JsonProperty("profile-photo") boolean profilePhoto) {
    public static PhotoDto fromDomain(Photo photoDomain) {
        return new PhotoDto(photoDomain.getName(), photoDomain.isProfilePhoto());
    }
}
