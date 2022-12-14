package com.tutego.date4u.core.photo;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class PhotoController {
    private final PhotoService photoService;

    public PhotoController(PhotoService photoService) {
        this.photoService = photoService;
    }

    @GetMapping(
            path = "/photos/{imagename}",
            produces = MediaType.IMAGE_JPEG_VALUE
    )
    public ResponseEntity<?> photo(@PathVariable String imagename) {
        return ResponseEntity.of(photoService.download(imagename));
    }

//    @GetMapping(
//            path = "/photos/{imagename}",
//            produces = MediaType.IMAGE_JPEG_VALUE
//    )
//    public StreamingResponseBody getPhotoByName(@PathVariable String imagename) {
//        return outputStream -> outputStream.write(
//                photoService.download(imagename)
//                        .orElseThrow(ResourceNotFoundException::new)
//        );
//    }
}
