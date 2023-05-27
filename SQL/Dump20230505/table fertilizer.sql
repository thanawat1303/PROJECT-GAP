DROP TABLE line_chat_gap.formFertilizer;
CREATE TABLE line_chat_gap.formFertilizer (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL ,
    id_plant varchar(50) NOT NULL ,
    name_fer varchar(50) NOT NULL ,
    formula_fer varchar(50) NOT NULL ,
    use_fer varchar(100) NOT NULL ,
    volume_fer INT NOT NULL ,
    date_fer varchar(50) NOT NULL
);