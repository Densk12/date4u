package com.tutego.date4u.core.security;

import com.tutego.date4u.core.photo.Photo;
import com.tutego.date4u.core.photo.PhotoService;
import com.tutego.date4u.core.profile.Profile;
import com.tutego.date4u.core.profile.ProfileData;
import com.tutego.date4u.core.profile.ProfileRepository;
import com.tutego.date4u.core.unicorn.Unicorn;
import com.tutego.date4u.core.unicorn.UnicornData;
import com.tutego.date4u.core.unicorn.UnicornRepository;
import com.tutego.date4u.core.unicorn.UnicornService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1")
public class JwtAuthenticationController {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final JwtUserDetailsService jwtUserDetailsService;
    private final UnicornService unicornService;
    private final PhotoService photoService;
    private final UnicornRepository unicornRepository;
    private final ProfileRepository profileRepository;

    public JwtAuthenticationController(
            AuthenticationManager authenticationManager,
            JwtTokenUtil jwtTokenUtil,
            JwtUserDetailsService jwtUserDetailsService,
            UnicornService unicornService,
            PhotoService photoService,
            UnicornRepository unicornRepository,
            ProfileRepository profileRepository
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenUtil = jwtTokenUtil;
        this.jwtUserDetailsService = jwtUserDetailsService;
        this.unicornService = unicornService;
        this.photoService = photoService;
        this.unicornRepository = unicornRepository;
        this.profileRepository = profileRepository;
    }

    @PostMapping(
            value = "/authenticate",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> authenticateUser(@RequestBody JwtRequest authenticationRequest) throws Exception {
        authenticate(authenticationRequest.username(), authenticationRequest.password());

        UserDetails userDetails = jwtUserDetailsService
                .loadUserByUsername(authenticationRequest.username());

        String token = jwtTokenUtil.generateToken(userDetails);

        return ResponseEntity.ok(new JwtResponse(((Unicorn) userDetails).getProfile().getId(), token));
    }

    @PostMapping(
            value = "/register",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> registerUser(@RequestBody RegistrationDto registrationDto) throws IOException {
        UnicornData unicornData =
                new UnicornData(registrationDto.email(), registrationDto.password());

        ProfileData profileData =
                new ProfileData(registrationDto.birthday(), registrationDto.nickname(),
                        registrationDto.hornlength(), registrationDto.gender(),
                        registrationDto.attractedToGender(), registrationDto.description());

        boolean registered = unicornService.register(unicornData, profileData);

        if (registered) {
            Unicorn unicorn = unicornRepository.findUnicornByEmail(unicornData.email()).get();
            Profile profile = unicorn.getProfile();

            String photoName = photoService.upload(registrationDto.image().getBytes());
            Photo photo = new Photo(null, profile, photoName, true, LocalDateTime.now());
            profile.add(photo);
            profileRepository.save(profile);

            UserDetails userDetails = unicorn;
            String token = jwtTokenUtil.generateToken(userDetails);

            return ResponseEntity.ok(new JwtResponse(profile.getId(), token));
        }

        return ResponseEntity.badRequest().build();
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }
}