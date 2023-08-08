DROP TABLE line_chat_gap.housefarm;
CREATE TABLE line_chat_gap.housefarm (
    id_farm_house INT NOT NULL PRIMARY KEY AUTO_INCREMENT ,
    uid_line varchar(255) NOT NULL ,
    link_user varchar(50) NOT NULL,
    name_house varchar(50) NOT NULL ,
    img_house LONGBLOB NOT NULL
);

-- ALTER TABLE line_chat_gap.housefarm
-- RENAME COLUMN id_farmHouse TO id_farm_house;