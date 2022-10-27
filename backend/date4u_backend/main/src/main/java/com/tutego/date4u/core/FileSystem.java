package com.tutego.date4u.core;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class FileSystem {

    private final Path root = Paths.get(System.getProperty("user.dir")).resolve("fs").toAbsolutePath().normalize();

    public FileSystem() {
        if (!Files.isDirectory(root)) {
            try {
                Files.createDirectory(root);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public long getFreeDiskSpace() {
        return root.toFile().getFreeSpace();
    }

    public byte[] load(String filename) {
        try {
            Path path = resolve(filename);
            return Files.readAllBytes(path);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    public void store(String filename, byte[] bytes) {
        try {
            Files.write(resolve(filename), bytes);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    private Path resolve(String filename) {
        Path path = root.resolve(filename).toAbsolutePath().normalize();
        if (!path.startsWith(root))
            throw new SecurityException("Access to " + path + " denied");
        return path;
    }

}
