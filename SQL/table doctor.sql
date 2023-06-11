DROP TABLE line_chat_gap.acc_doctor;
CREATE TABLE line_chat_gap.acc_doctor (
    id_table_doctor INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_doctor varchar(10) NOT NULL,
    uid_line_doctor varchar(50) NOT NULL,
    password_doctor varchar(256) NOT NULL,
    fullname_doctor varchar(50) NOT NULL,
    station_doctor varchar(50) NOT NULL,
    img_doctor LONGBLOB NOT NULL,
    status_account BOOLEAN NOT NULL,
    status_delete BOOLEAN NOT NULL
);