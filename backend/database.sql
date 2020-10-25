CREATE DATABASE user_authentication;

CREATE TABLE users (id BIGSERIAL NOT NULL PRIMARY KEY, username VARCHAR(100) NOT NULL, email VARCHAR(255) NOT NULL, password TEXT NOT NULL);

INSERT INTO users (username, email, password) VALUES ('johndoe', 'johndoe@gmail.com', 'password');