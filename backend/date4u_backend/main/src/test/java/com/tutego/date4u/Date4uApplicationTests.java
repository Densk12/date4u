package com.tutego.date4u;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource( locations = "classpath:test.properties",
    properties = "spring.shell.interactive.enabled=false" )
class Date4uApplicationTests {

  private final Logger log = LoggerFactory.getLogger( getClass() );

  @Value( "${date4u.filesystem.minimum-free-disk-space}" )
  long minimumFreeDiskSpace;

  @Test
  void contextLoads() {
    log.info( "{}", minimumFreeDiskSpace );
  }
}
