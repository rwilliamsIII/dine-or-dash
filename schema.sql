CREATE DATABASE restaurant_db;

USE restaurant_db;

CREATE TABLE disliked
(
    id VARCHAR(255),
    alias VARCHAR(255)
    PRIMARY KEY (id)
);

CREATE TABLE liked
(
    id VARCHAR(255),
    alias VARCHAR(255),
    rest_pic VARBINARY(8000)
    phone_number INT(255),
    rest_address VARCHAR(255),
    favorite BOOLEAN default false
);

