DROP TABLE line_chat_gap.formPlant;
-- DELETE FROM line_chat_gap.formPlant;
CREATE TABLE line_chat_gap.formPlant (
    id varchar(50) NOT NULL PRIMARY KEY,
    id_farm_house varchar(255) NOT NULL ,
    name_plant varchar(50) NOT NULL ,
    generation INT NOT NULL,
    date_glow varchar(50) NOT NULL,
    date_plant varchar(50) NOT NULL,
    posi_w INT NOT NULL,
    posi_h INT NOT NULL,
    qty INT NOT NULL,
    area INT NOT NULL ,
    date_harvest varchar(50) NOT NULL,
    system_glow varchar(50) NOT NULL ,
    water varchar(50) NOT NULL ,
    water_flow varchar(50) NOT NULL ,
    history varchar(50) NOT NULL ,
    insect varchar(50) NOT NULL,
    qtyInsect varchar(50) NOT NULL,
    seft varchar(200) NOT NULL, 
    submit INT NOT NULL,
    date_success varchar(50) NOT NULL
);
-- ALTER TABLE line_chat_gap.formPlant
-- ADD date_success varchar(50) NOT NULL;

-- ALTER TABLE line_chat_gap.formPlant
-- DROP COLUMN date_success;

-- -- id_uid_line