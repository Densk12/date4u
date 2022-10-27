package com.tutego.date4u.core.security;

import com.fasterxml.jackson.annotation.JsonProperty;

public record JwtResponse(@JsonProperty("profile-id") long profileId, @JsonProperty("jwt-token") String jwtToken) {
}