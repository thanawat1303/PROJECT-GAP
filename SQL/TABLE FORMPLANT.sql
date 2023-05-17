CREATE TABLE line_chat_gap.formPlant (
    id_plant varchar(50) NOT NULL PRIMARY KEY,
    id_farmer varchar(50) NOT NULL ,
    type_plant varchar(50) NOT NULL ,
    genartion_plant INT NOT NULL,
    date_plant DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    qty_plant INT NOT NULL,
    space_plant varchar(50) NOT NULL ,
    date_harvest DATE NOT NULL ,
    system_plant varchar(50) NOT NULL ,
    water_plant varchar(50) NOT NULL ,
    water_flow_plant varchar(50) NOT NULL ,
    history_plant varchar(50) NOT NULL ,
    submit_plant INT NOT NULL 
)