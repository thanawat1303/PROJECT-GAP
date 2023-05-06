CREATE TABLE line_chat_gap.AccountDT (
    id_docter varchar(10) NOT NULL PRIMARY KEY,
    Password_docter varchar(50) NOT NULL,
    Fullname_docter varchar(50) NOT NULL,
    Job_care_center varchar(50) NOT NULL,
    Image_docter LONGBLOB NOT NULL,
    Status_account BOOLEAN NOT NULL
    Status_delete BOOLEAN NOT NULL
);