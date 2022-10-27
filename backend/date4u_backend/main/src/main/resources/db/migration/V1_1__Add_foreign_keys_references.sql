ALTER TABLE Unicorn ADD FOREIGN KEY (profile_fk) REFERENCES Profile (id);
ALTER TABLE Likes ADD FOREIGN KEY (liker_fk) REFERENCES Profile (id);
ALTER TABLE Likes ADD FOREIGN KEY (likee_fk) REFERENCES Profile (id);
ALTER TABLE Photo ADD FOREIGN KEY (profile_fk) REFERENCES Profile (id);