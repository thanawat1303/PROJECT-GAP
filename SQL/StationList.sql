DROP TABLE line_chat_gap.station_list;
CREATE TABLE line_chat_gap.station_list (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name varchar(50) NOT NULL,
    is_use BOOLEAN NOT NULL,
    location POINT NOT NULL
);