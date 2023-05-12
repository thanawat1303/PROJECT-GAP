-- SELECT id_farmer , COUNT(id_farmer) FROM line_chat_gap.acc_farmer WHERE station = "ราชมงคล" and register_auth = 0 GROUP BY id_farmer;
-- SELECT id_table , id_farmer
-- FROM  line_chat_gap.acc_farmer 
-- WHERE station = "ราชมงคล" and register_auth = 0 and 1
-- -- GROUP BY id_farmer 
-- ORDER BY date_register DESC

SELECT acc_farmer.id_table , acc_farmer.id_farmer , acc_farmer.fullname , acc_farmer.img  FROM line_chat_gap.acc_farmer , 
(
    SELECT MAX(id_table) AS id_table , id_farmer , MAX(date_register) AS date_register
    FROM  line_chat_gap.acc_farmer 
    WHERE station = "ราชมงคล" and register_auth = 0 
    GROUP BY id_farmer 
    ORDER BY date_register
) AS MaxRowDate
WHERE acc_farmer.id_table = MaxRowDate.id_table

-- SELECT id_table , ID.id_farmer FROM line_chat_gap.acc_farmer 
-- , 
-- (
--     SELECT id_farmer
--     FROM  line_chat_gap.acc_farmer 
--     WHERE station = "ราชมงคล" and register_auth = 0
--     GROUP BY id_farmer 
-- ) AS ID 
-- WHERE acc_farmer.id_farmer = ID.id_farmer