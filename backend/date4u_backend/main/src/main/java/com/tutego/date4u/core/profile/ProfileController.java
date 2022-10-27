package com.tutego.date4u.core.profile;

import com.tutego.date4u.core.photo.Photo;
import com.tutego.date4u.core.photo.PhotoDto;
import com.tutego.date4u.core.photo.PhotoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/profiles")
public class ProfileController {
    private final ProfileRepository profileRepository;
    private final PhotoService photoService;
    private final ProfileService profileService;

    public ProfileController(
            ProfileRepository profileRepository,
            PhotoService photoService,
            ProfileService profileService
    ) {
        this.profileRepository = profileRepository;
        this.photoService = photoService;
        this.profileService = profileService;
    }

    @GetMapping(
            value = "/{id}",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> getProfileById(@PathVariable("id") long profileId) {
        return ResponseEntity.of(profileRepository.findById(profileId).map(ProfileDto::fromDomain));
    }

    @GetMapping(
            value = "/{id}",
            produces = MediaType.APPLICATION_JSON_VALUE,
            params = {"age-start", "age-end", "hornlength-start", "hornlength-end", "gender"}
    )
    public ResponseEntity<?> getProfilesByFilterCriterias(
            @RequestParam("age-start") int ageStart,
            @RequestParam("age-end") int ageEnd,
            @RequestParam("hornlength-start") int hornlengthStart,
            @RequestParam("hornlength-end") int hornlengthEnd,
            @RequestParam("gender") int gender,
            @RequestParam("page") int page,
            @RequestParam("page-size") int pageSize
    ) {
        if (ageStart >= 18) {
            if (ageStart <= ageEnd && hornlengthStart <= hornlengthEnd) {
                if (page >= 0 && pageSize > 0) {
                    SearchData searchData = new SearchData(
                            ageStart, ageEnd,
                            hornlengthStart, hornlengthEnd,
                            gender
                    );

                    Page<Profile> profiles = profileService
                            .searchProfiles(searchData, PageRequest.of(page, pageSize));

                    return ResponseEntity.ok(new SearchResultDto(
                            profiles.getContent().stream().map(ProfileDto::fromDomain).toList(),
                            (int) profiles.getTotalElements(),
                            page
                    ));
                }
            }
        }

        return ResponseEntity.badRequest().build();
    }

    @GetMapping(
            value = "/{id}/likes",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> getLikesByProfileId(@PathVariable("id") long profileId) {
        Optional<Profile> maybeProfile = profileRepository.findById(profileId);

        if (maybeProfile.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Set<Profile> profilesILiked = maybeProfile.get().getProfilesThatILike();

        return ResponseEntity.ok(profilesILiked.stream().map(ProfileDto::fromDomain).toList());
    }

    @GetMapping(
            value = "/{id}/photos",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> getPhotosByProfileId(@PathVariable("id") long profileId) {
        return ResponseEntity.of(profileRepository.findById(profileId)
                .map(profile -> profile.getPhotos().stream().map(PhotoDto::fromDomain)));
    }

    @PostMapping(
            value = "/{id}/likes",
            consumes = MediaType.TEXT_PLAIN_VALUE
    )
    public ResponseEntity<?> createLikeByProfileId(
            @PathVariable("id") long profileId,
            RequestEntity<String> requestEntity
    ) {
        String profileIdLikedString = requestEntity.getBody();
        if (profileIdLikedString == null) {
            return ResponseEntity.notFound().build();
        }

        Long profileIdLiked;
        try {
            profileIdLiked = Long.valueOf(profileIdLikedString);
        } catch (NumberFormatException e) {
            return ResponseEntity.notFound().build();
        }

        Optional<Profile> maybeProfileOwner = profileRepository.findById(profileId);
        Optional<Profile> maybeProfileLiked = profileRepository.findById(profileIdLiked);

        if (maybeProfileOwner.isEmpty() || maybeProfileLiked.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Profile profileOwner = maybeProfileOwner.get();
        Profile profileLiked = maybeProfileLiked.get();

        profileOwner.getProfilesThatILike().add(profileLiked);

        profileRepository.save(profileOwner);

        return ResponseEntity.ok().build();
    }

    @PostMapping(
            value = "/{id}/photos",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> createPhotoByProfileId(
            @PathVariable("id") long profileId,
            @RequestParam("image") MultipartFile image
    ) throws IOException {
        Optional<Profile> maybeProfile = profileRepository.findById(profileId);

        if (maybeProfile.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Profile profile = maybeProfile.get();

        String photoName = photoService.upload(image.getBytes());
        Photo photo = new Photo(null, profile, photoName, false, LocalDateTime.now());

        profile.add(photo);

        profileRepository.save(profile);

        return ResponseEntity.created(URI.create("/api/v1/photos/" + photoName)).build();
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ProfileDto> updateProfileById(
            @PathVariable("id") long profileId,
            RequestEntity<ProfileDto> requestEntity
    ) {
        Optional<Profile> maybeProfile = profileRepository.findById(profileId);

        if (maybeProfile.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Profile profile = maybeProfile.get();
        ProfileDto profileUpdated = requestEntity.getBody();

        profile.setNickname(profileUpdated.nickname());
        profile.setBirthdate(profileUpdated.birthday());
        profile.setHornlength(profileUpdated.hornlength());
        profile.setGender(profileUpdated.gender());
        profile.setAttractedToGender(profileUpdated.attractedToGender());

        profileRepository.save(profile);

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping(
            path = "/{id}/likes",
            consumes = MediaType.TEXT_PLAIN_VALUE
    )
    public ResponseEntity<?> deleteLikeByProfileId(
            @PathVariable("id") long profileId,
            RequestEntity<String> requestEntity
    ) {
        String profileIdLikedString = requestEntity.getBody();
        if (profileIdLikedString == null) {
            return ResponseEntity.notFound().build();
        }

        Long profileIdLiked;
        try {
            profileIdLiked = Long.valueOf(profileIdLikedString);
        } catch (NumberFormatException e) {
            return ResponseEntity.notFound().build();
        }

        Optional<Profile> maybeProfileOwner = profileRepository.findById(profileId);
        Optional<Profile> maybeProfileLiked = profileRepository.findById(profileIdLiked);

        if (maybeProfileOwner.isEmpty() || maybeProfileLiked.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Profile profileOwner = maybeProfileOwner.get();
        Profile profileLiked = maybeProfileLiked.get();

        profileOwner.getProfilesThatILike().remove(profileLiked);

        profileRepository.save(profileOwner);

        return ResponseEntity.ok().build();
    }
}
