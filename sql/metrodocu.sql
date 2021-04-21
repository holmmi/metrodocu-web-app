DROP DATABASE IF EXISTS metrodocu;
CREATE DATABASE metrodocu;
USE metrodocu;

CREATE TABLE user(
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(40) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password CHAR(60) NOT NULL,
    avatar_location VARCHAR(80),
    start_timestamp TIMESTAMP(6) GENERATED ALWAYS AS ROW START,
    end_timestamp TIMESTAMP(6) GENERATED ALWAYS AS ROW END,
    PERIOD FOR SYSTEM_TIME(start_timestamp, end_timestamp)
) WITH SYSTEM VERSIONING;

CREATE TABLE group_detail(
    group_id INT PRIMARY KEY,
    group_name VARCHAR(40) NOT NULL
);

CREATE TABLE user_group(
    member_id INT PRIMARY KEY AUTO_INCREMENT,
    group_id INT NOT NULL,
    user_id INT NOT NULL,

    FOREIGN KEY (group_id) REFERENCES group_detail (group_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user (user_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE story_visibility(
    visibility_id INT PRIMARY KEY,
    visibility_description VARCHAR(20) NOT NULL
);

CREATE TABLE story(
    story_id INT PRIMARY KEY AUTO_INCREMENT,
    story_name VARCHAR(50) NOT NULL,
    story_description VARCHAR(200),
    cover_photo VARCHAR(60),
    visibility_id INT NOT NULL,
    creation_date DATE NOT NULL DEFAULT CURDATE(),
    owner_id INT NOT NULL,

    FOREIGN KEY (visibility_id) REFERENCES story_visibility (visibility_id) ON UPDATE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES user (user_id) ON UPDATE CASCADE
);

CREATE TABLE story_document(
    document_id INT PRIMARY KEY AUTO_INCREMENT,
    document_name VARCHAR(50) NOT NULL,
    document_mime VARCHAR(20) NOT NULL,
    document_location VARCHAR(60) NOT NULL,
    story_id INT,
    start_timestamp TIMESTAMP(6) GENERATED ALWAYS AS ROW START,
    end_timestamp TIMESTAMP(6) GENERATED ALWAYS AS ROW END,
    PERIOD FOR SYSTEM_TIME(start_timestamp, end_timestamp),

    FOREIGN KEY (story_id) REFERENCES story (story_id) ON UPDATE CASCADE ON DELETE SET NULL -- Allow cron to cleanup removed documents
) WITH SYSTEM VERSIONING;

CREATE TABLE story_share(
    share_id INT PRIMARY KEY AUTO_INCREMENT,
    story_id INT NOT NULL,
    user_id INT NOT NULL,

    FOREIGN KEY (story_id) REFERENCES story (story_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user (user_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE story_like(
    like_id INT PRIMARY KEY AUTO_INCREMENT,
    story_id INT NOT NULL,
    user_id INT NOT NULL UNIQUE,

    FOREIGN KEY (story_id) REFERENCES story (story_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user (user_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE story_comment(
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    user_id INT NOT NULL,
    story_id INT NOT NULL,
    comment TEXT(500) NOT NULL,    

    FOREIGN KEY (story_id) REFERENCES story (story_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user (user_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX idx_username ON user (username);
CREATE INDEX idx_story ON story (owner_id, visibility_id);
CREATE INDEX idx_member ON user_group (group_id, user_id);
CREATE INDEX idx_story_document ON story_document (story_id);
CREATE INDEX idx_story_share ON story_share (story_id, user_id);
CREATE INDEX idx_story_like ON story_like (story_id, user_id);

INSERT INTO story_visibility VALUES (1, 'Private'), (2, 'Public'), (3, 'Owner only');

INSERT INTO group_detail VALUES (1, 'User'), (2, 'Admin'); 

DROP USER IF EXISTS 'metrodocu'@'localhost';
CREATE USER 'metrodocu'@'localhost' IDENTIFIED BY 'changeme';
GRANT INSERT, UPDATE, DELETE, SELECT ON metrodocu.* TO 'metrodocu'@'localhost';