package com.tutego.date4u.core.profile;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    Page<Profile> searchProfiles(SearchData searchData, PageRequest pageRequest) {
        int yearNow = LocalDate.now().getYear();

        return profileRepository.search(new SearchFilter(
                searchData.gender(),
                LocalDate.of(yearNow - searchData.ageEnd(), 1, 1),
                LocalDate.of(yearNow - searchData.ageStart(), 1, 1),
                searchData.hornlengthStart(),
                searchData.hornlengthEnd()
        ), pageRequest);
    }
}
