package com.tutego.date4u.core.photo;

import com.tutego.date4u.core.FileSystem;
import org.assertj.core.api.InstanceOfAssertFactories;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.Base64;
import java.util.Set;
import java.util.function.Function;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

//@ExtendWith( MockitoExtension.class )
@SpringBootTest( { "spring.shell.interactive.enabled=false" } )
class PhotoServiceTest {

  private static final byte[] MINIMAL_JPG = Base64.getDecoder().decode(
      "/9j/4AAQSkZJRgABAQEASABIAAD"
      + "/2wBDAP////////////////////////////////////////////////////////////"
      + "//////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAA"
      + "AAAAP/aAAgBAQABPxA=" );                      // https://git.io/J9GXr

  //  @Mock( lenient = true ) FileSystem fs;
  //  @Spy AwtBicubicThumbnail thumbnail;
  //  @InjectMocks PhotoService photoService;
  @MockBean FileSystem fs;
  @Autowired PhotoService photoService;

  @BeforeEach
  void init() {
    when( fs.load( any() ) ).thenReturn( MINIMAL_JPG );
  }

  @Test
  void successful_photo_upload() {
    String imageName = photoService.upload( MINIMAL_JPG );
    assertThat( imageName ).isNotEmpty();
    //    verify( fs, times( 2 ) ).store( anyString(), any( byte[].class ) );
    //    verify( thumbnail ).thumbnail( any( byte[].class ) );
  }

//  @Nested
//  class Validator {
//    @Test
//    void photo_is_valid() {
//      Photo photo = new Photo( 1L, 1L, "fillmorespic", false, LocalDateTime.MIN );
//      assertThatCode( () -> photoService.download( photo ) ).doesNotThrowAnyException();
//    }
//
//    @Test
//    void photo_has_invalid_birthdate() {
//      LocalDateTime future = LocalDateTime.of( 2500, 1, 1, 0, 0, 0 );
//      Photo photo = new Photo( 1L, 1L, "fillmorespic", false, future );
//      Function<Throwable, ?> constraintViolationsFromThrowable = throwable -> ((ConstraintViolationException) throwable).getConstraintViolations();
//      assertThatThrownBy( () -> photoService.download( photo ) )
//          .isInstanceOf( ConstraintViolationException.class )
//          .extracting( constraintViolationsFromThrowable,
//                       as( InstanceOfAssertFactories.collection( ConstraintViolation.class ) ) )
//          .hasSize( 1 )
//          .first( InstanceOfAssertFactories.type( ConstraintViolation.class ) )
//          .satisfies( vio -> {
//            assertThat( vio.getRootBeanClass() ).isSameAs( PhotoService.class );
//            assertThat( vio.getLeafBean() ).isExactlyInstanceOf( Photo.class );
//            assertThat( vio.getPropertyPath() ).hasToString( "download.photo.created" );
//            assertThat( vio.getInvalidValue() ).isEqualTo( future );
//            assertThat( vio.getMessage() ).isEqualTo( "muss ein Datum in der Vergangenheit sein" );
//          } );
//    }
//  }
}
