CREATE TABLE report_detail (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    id_plant VARCHAR(50) NOT NULL ,
    report_text LONGTEXT NOT NULL,
    id_table_doctor INT NOT NULL,
    date_report DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE check_form_detail (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    id_plant VARCHAR(50) NOT NULL ,
    status_check INT NOT NULL,
    note_text LONGTEXT NOT NULL,
    id_table_doctor INT NOT NULL,
    date_check DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE check_plant_detail (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    id_plant VARCHAR(50) NOT NULL ,
    status_check INT NOT NULL,
    state_check BOOLEAN NOT NULL,
    note_text LONGTEXT NOT NULL,
    id_table_doctor INT NOT NULL,
    date_check DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);