package com.tutego.date4u.core.security;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

public record RegistrationDto(
        String email,
        String password,
        LocalDate birthday,
        String nickname,
        Integer hornlength,
        Integer gender,
        @JsonProperty("attracted-to-gender")
        Integer attractedToGender,
        String description,
        MultipartFile image
) {
}