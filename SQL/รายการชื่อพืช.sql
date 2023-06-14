-- CREATE TABLE plant_type (
--     id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
--     namePlant VARCHAR(50) NOT NULL
-- );
ALTER TABLE line_chat_gap.station_list
RENAME COLUMN id TO id;

-- ALTER TABLE line_chat_gap.plant_list
-- RENAME plant_list TO plant_list;

-- ALTER TABLE line_chat_gap.station_list
-- ADD is_use BOOLEAN NOT NULL
-- UPDATE line_chat_gap.station_list SET is_use = 1