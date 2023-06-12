DROP TABLE line_chat_gap.because_delete;
DROP TABLE line_chat_gap.because_status;

CREATE TABLE line_chat_gap.because_delete (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL ,
    id_table_doctor varchar(50) NOT NULL ,
    id_admin varchar(50) NOT NULL ,
    because_text longtext NOT NULL ,
    date varchar(50) NOT NULL
);

CREATE TABLE line_chat_gap.because_status (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL ,
    id_table_doctor varchar(50) NOT NULL ,
    id_admin varchar(50) NOT NULL ,
    because_text longtext NOT NULL ,
    date varchar(50) NOT NULL , 
    type_status BOOLEAN NOT NULL
);