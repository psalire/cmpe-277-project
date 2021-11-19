CREATE TABLE Users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(128) NOT NULL,
    username VARCHAR(16) NOT NULL,
    salt BLOB NOT NULL,
    password BLOB NOT NULL,
    phone VARCHAR(32),
    UNIQUE KEY unique_email (email),
    UNIQUE KEY unique_username (username),
    UNIQUE KEY unique_phone (phone)
);
