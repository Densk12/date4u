package com.tutego.date4u.core.unicorn;

import com.tutego.date4u.core.profile.Profile;
import com.tutego.date4u.core.profile.ProfileData;
import com.tutego.date4u.core.profile.ProfileRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UnicornService {
    private final UnicornRepository unicornRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    public UnicornService(
            UnicornRepository unicornRepository,
            ProfileRepository profileRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.unicornRepository = unicornRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean register(
            UnicornData unicornData,
            ProfileData profileData
    ) {
        boolean registered = false;

        Optional<Unicorn> maybeUnicorn = unicornRepository.findUnicornByEmail(unicornData.email());

        if (maybeUnicorn.isEmpty()) {
            Profile profile = new Profile(profileData.nickname(), profileData.birthday(),
                    profileData.hornlength(), profileData.gender(),
                    profileData.attractedToGender(), profileData.description(),
                    LocalDateTime.now());
            profileRepository.save(profile);

            Unicorn unicorn = new Unicorn(unicornData.email(), passwordEncoder.encode(unicornData.password()), profile);
            unicornRepository.save(unicorn);

            registered = true;
        }

        return registered;
    }
}
