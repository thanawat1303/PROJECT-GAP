DROP TABLE line_chat_gap.housefarm;
CREATE TABLE line_chat_gap.housefarm (
    id_farmHouse INT NOT NULL PRIMARY KEY AUTO_INCREMENT ,
    uid_line varchar(255) NOT NULL ,
    name_house varchar(50) NOT NULL ,
    img_house varchar(50) NOT NULL
);