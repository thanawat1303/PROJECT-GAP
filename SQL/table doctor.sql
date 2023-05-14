CREATE TABLE line_chat_gap.acc_doctor (
    id_doctor varchar(10) NOT NULL PRIMARY KEY,
    uid_line_doctor varchar(50) NOT NULL,
    password_doctor varchar(256) NOT NULL,
    fullname_doctor varchar(50) NOT NULL,
    station_doctor varchar(50) NOT NULL,
    img_doctor LONGBLOB NOT NULL,
    status_account BOOLEAN NOT NULL,
    status_delete BOOLEAN NOT NULL
);