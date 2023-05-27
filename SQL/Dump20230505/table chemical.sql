DROP TABLE formChemical;
CREATE TABLE formChemical (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT ,
    id_plant varchar(50) NOT NULL ,
    name_che varchar(50) NOT NULL ,
    surname_che varchar(50) NOT NULL ,
    found_pest varchar(100) NOT NULL ,
    use_che varchar(100) NOT NULL ,
    rate_che varchar(20) NOT NULL ,
    volume_che INT NOT NULL ,
    date_safe varchar(100) NOT NULL ,
    source_che varchar(50) NOT NULL
);