DROP TABLE formChemical;
CREATE TABLE formChemical (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT ,
    id_plant varchar(50) NOT NULL ,
    name varchar(50) NOT NULL ,
    formula_name varchar(50) NOT NULL ,
    insect varchar(100) NOT NULL ,
    use_is varchar(100) NOT NULL ,
    rate varchar(20) NOT NULL ,
    volume varchar(100) NOT NULL ,
    date_safe varchar(100) NOT NULL ,
    date varchar(100) NOT NULL ,
    source varchar(50) NOT NULL
);