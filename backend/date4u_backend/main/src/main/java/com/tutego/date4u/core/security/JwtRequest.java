package com.tutego.date4u.core.security;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record JwtRequest(
        @NotEmpty
        @Email
        String email,
        @NotEmpty
        @Size(min = 2)
        String password
) {
}