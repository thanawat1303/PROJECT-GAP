CREATE TABLE line_chat_gap.acc_docter (
    id_docter varchar(10) NOT NULL PRIMARY KEY,
    uid_line_docter varchar(50) NOT NULL,
    password_docter varchar(256) NOT NULL,
    fullname_docter varchar(50) NOT NULL,
    station_docter varchar(50) NOT NULL,
    img_docter LONGBLOB NOT NULL,
    status_account BOOLEAN NOT NULL,
    status_delete BOOLEAN NOT NULL
);