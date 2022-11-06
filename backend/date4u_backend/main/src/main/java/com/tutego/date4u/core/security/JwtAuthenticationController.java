package com.tutego.date4u.core.security;

import com.tutego.date4u.core.photo.PhotoService;
import com.tutego.date4u.core.profile.Profile;
import com.tutego.date4u.core.profile.ProfileData;
import com.tutego.date4u.core.unicorn.Unicorn;
import com.tutego.date4u.core.unicorn.UnicornData;
import com.tutego.date4u.core.unicorn.UnicornRepository;
import com.tutego.date4u.core.unicorn.UnicornService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class JwtAuthenticationController {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final JwtUserDetailsService jwtUserDetailsService;
    private final UnicornService unicornService;
    private final PhotoService photoService;
    private final UnicornRepository unicornRepository;

    private final Logger log = LoggerFactory.getLogger(getClass());

    public JwtAuthenticationController(
            AuthenticationManager authenticationManager,
            JwtTokenUtil jwtTokenUtil,
            JwtUserDetailsService jwtUserDetailsService,
            UnicornService unicornService,
            PhotoService photoService,
            UnicornRepository unicornRepository
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenUtil = jwtTokenUtil;
        this.jwtUserDetailsService = jwtUserDetailsService;
        this.unicornService = unicornService;
        this.photoService = photoService;
        this.unicornRepository = unicornRepository;
    }

    @PostMapping(
            value = "/authenticate",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody JwtRequest authenticationRequest) throws Exception {
        authenticate(authenticationRequest.email(), authenticationRequest.password());

        UserDetails userDetails = jwtUserDetailsService
                .loadUserByUsername(authenticationRequest.email());

        String token = jwtTokenUtil.generateToken(userDetails);

        return ResponseEntity.ok(new JwtResponse(((Unicorn) userDetails).getProfile().getId(), token));
    }

    @PostMapping(
            value = "/register",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegistrationDto registrationDto) throws Exception {
        UnicornData unicornData =
                new UnicornData(registrationDto.email(), registrationDto.password());

        ProfileData profileData =
                new ProfileData(registrationDto.birthday(), registrationDto.nickname(),
                        registrationDto.hornlength(), registrationDto.gender(),
                        registrationDto.attractedToGender(), registrationDto.description());

        boolean registered = unicornService.register(unicornData, profileData);

        if (registered) {
            authenticate(registrationDto.email(), registrationDto.password());

            Unicorn unicorn = unicornRepository.findUnicornByEmail(unicornData.email()).get();
            Profile profile = unicorn.getProfile();

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