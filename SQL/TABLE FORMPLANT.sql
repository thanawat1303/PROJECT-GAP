DROP TABLE line_chat_gap.formPlant;
-- DELETE FROM line_chat_gap.formPlant;
CREATE TABLE line_chat_gap.formPlant (
    id varchar(50) NOT NULL PRIMARY KEY,
    id_farm_house varchar(255) NOT NULL ,
    name_plant varchar(50) NOT NULL ,
    generation INT NOT NULL,
    date_glow varchar(50) NOT NULL,
    date_plant varchar(50) NOT NULL,
    posi_w FLOAT NOT NULL,
    posi_h FLOAT NOT NULL,
    qty INT NOT NULL,
    area FLOAT NOT NULL ,
    date_harvest varchar(50) NOT NULL,
    system_glow varchar(50) NOT NULL ,
    water varchar(50) NOT NULL ,
    water_flow varchar(50) NOT NULL ,
    history varchar(50) NOT NULL ,
    insect varchar(50) NOT NULL,
    qtyInsect varchar(50) NOT NULL,
    seft varchar(200) NOT NULL, 
    state_status INT NOT NULL,
    date_success varchar(50) NOT NULL
);
-- ALTER TABLE line_chat_gap.formPlant
-- ADD date_success varchar(50) NOT NULL;

-- ALTER TABLE line_chat_gap.formPlant
-- DROP COLUMN date_success;

-- -- id_uid_line

-- ALTER TABLE line_chat_gap.formPlant
-- RENAME COLUMN id_farmHouse TO id_farm_house;

-- ALTER TABLE line_chat_gap.`formplant` CHANGE `posi_w` `posi_w` FLOAT NOT NULL;
-- ALTER TABLE line_chat_gap.`formplant` CHANGE `posi_h` `posi_h` FLOAT NOT NULL;
-- ALTER TABLE line_chat_gap.`formplant` CHANGE `area` `area` FLOAT NOT NULL;
-- ALTER TABLE line_chat_gap.`formplant`
-- RENAME COLUMN submit TO state_status