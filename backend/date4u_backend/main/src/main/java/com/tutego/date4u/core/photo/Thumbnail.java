package com.tutego.date4u.core.photo;

import org.springframework.scheduling.annotation.Async;

import java.util.concurrent.Future;

public interface Thumbnail {

  @Async
  Future<byte[]> thumbnail( byte[] imageBytes );
}
