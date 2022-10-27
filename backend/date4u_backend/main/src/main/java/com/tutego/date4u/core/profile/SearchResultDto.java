package com.tutego.date4u.core.profile;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record SearchResultDto(
        @JsonProperty("profiles-page")
        List<ProfileDto> profilesPage,
        @JsonProperty("count-all-profiles")
        int countAllProfiles,
        @JsonProperty("current-page")
        int currentPage
) {
}