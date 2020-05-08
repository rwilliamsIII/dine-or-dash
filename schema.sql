DROP DATABASE IF EXISTS restaurants;

CREATE DATABASE restaurants;

USE DATABASE restaurants;

CREATE TABLE disliked
(
    id INT AUTO_INCREMENT,
    disliked_name VARCHAR(255)
    PRIMARY KEY (id)
);

CREATE TABLE liked
(
    id INT AUTO_INCREMENT,
    rest_name VARCHAR(255),
    phone_number INT(255),
    rest_address VARCHAR(255),
    favorite BOOLEAN default false
);