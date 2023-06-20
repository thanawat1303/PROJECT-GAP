-- DROP TABLE line_chat_gap.fertilizer_list;
-- DROP TABLE line_chat_gap.chemical_list;

CREATE TABLE line_chat_gap.fertilizer_list (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT , 
    name varchar(50) NOT NULL ,
    name_formula varchar(50) NOT NULL ,
    how_use longtext NOT NULL,
    is_use BOOLEAN NOT NULL
);

CREATE TABLE line_chat_gap.chemical_list (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT , 
    name varchar(50) NOT NULL ,
    name_formula varchar(50) NOT NULL ,
    how_use longtext NOT NULL , 
    date_sefe INT NOT NULL,
    is_use BOOLEAN NOT NULL
)