CREATE TABLE source_list (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name varchar(80) NOT NULL,
    is_use INT NOT NULL,
    location point NOT NULL
)