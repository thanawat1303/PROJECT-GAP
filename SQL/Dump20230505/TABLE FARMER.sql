CREATE TABLE `line_chat_gap`.`acc_farmer` (
    id_table INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_farmer varchar(50) NOT NULL,
    id_doctor varchar(50) NOT NULL,
    fullname varchar(50) NOT NULL,
    img LONGBLOB NOT NULL,
    station varchar(50) NOT NULL,
    location POINT NOT NULL,
    password varchar(256) NOT NULL,
    register_auth tinyint(1) NOT NULL,
    date_register DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    uid_line varchar(255) NOT NULL
)