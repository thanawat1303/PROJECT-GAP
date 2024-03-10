-- DROP TABLE message_doctor;
DROP TABLE line_chat_gap.message_user;

CREATE TABLE line_chat_gap.message_user (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    message longtext NOT NULL,
    uid_line_farmer varchar(255),
    id_read JSON NOT NULL,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    type varchar(50) NOT NULL,
    type_message varchar(10) NOT NULL
);

-- CREATE TABLE message_doctor (
--     id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
--     message longtext NOT NULL,
--     uid_line_farmer varchar(255),
--     date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );