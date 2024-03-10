DROP TABLE line_chat_gap.formFertilizer;
CREATE TABLE line_chat_gap.formFertilizer (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL ,
    id_plant varchar(50) NOT NULL ,
    name varchar(50) NOT NULL ,
    formula_name varchar(50) NOT NULL ,
    use_is varchar(100) NOT NULL ,
    volume varchar(100) NOT NULL ,
    source varchar(100) NOT NULL ,
    date varchar(50) NOT NULL
);