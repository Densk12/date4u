CREATE TABLE Unicorn (
                         id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                         email VARCHAR(64) UNIQUE NOT NULL,
                         password VARCHAR(128) NOT NULL,
                         profile_fk BIGINT
);

CREATE TABLE Profile (
                         id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                         birthdate DATE NOT NULL,
                         nickname VARCHAR(32) UNIQUE NOT NULL,
                         hornlength SMALLINT NOT NULL,
                         gender TINYINT NOT NULL,
                         attracted_to_gender TINYINT,
                         description VARCHAR(2048),
                         lastseen TIMESTAMP NOT NULL
);

CREATE TABLE Likes (
                       liker_fk BIGINT NOT NULL,
                       likee_fk BIGINT NOT NULL,
                       PRIMARY KEY (liker_fk, likee_fk)
);

CREATE TABLE Photo (
                       id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                       profile_fk BIGINT NOT NULL,
                       name VARCHAR(256) NOT NULL,
                       is_profile_photo BOOLEAN NOT NULL,
                       created TIMESTAMP NOT NULL
);