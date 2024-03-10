DROP TABLE success_detail;
CREATE TABLE success_detail (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL , 
    id_success varchar(100) NOT NULL , 
    id_plant varchar(50) NOT NULL ,
    type_success BOOLEAN NOT NULL ,
    id_table_doctor INT NOT NULL ,
    date_of_doctor DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_of_farmer varchar(100) NOT NULL 
);