DROP TABLE notify_doctor;

CREATE TABLE notify_doctor (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_table_farmer INT NOT NULL,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_read JSON NOT NULL,
    notify LONGTEXT NOT NULL,
    station INT NOT NULL
);