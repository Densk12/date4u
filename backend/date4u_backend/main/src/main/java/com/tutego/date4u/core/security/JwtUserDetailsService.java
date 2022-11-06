package com.tutego.date4u.core.security;

import com.tutego.date4u.core.unicorn.UnicornRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class JwtUserDetailsService implements UserDetailsService {
    private final UnicornRepository unicornRepository;

    public JwtUserDetailsService(UnicornRepository unicornRepository) {
        this.unicornRepository = unicornRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return unicornRepository
                .findUnicornByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(String.format("User with email '%s' not found.", email))
                );
    }
}