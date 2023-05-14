INSERT INTO line_chat_gap.acc_farmer(id_farmer,id_doctor,fullname,img,station,location,password,register_auth,uid_line) VALUES ("" , "" , "ธนวัฒน์ เอี่ยมใจดี" , "" , "ราชมงคล" , POINT(14,100) , SHA2("admin" , 256) , 0 , "")

-- DELETE FROM line_chat_gap.acc_farmer 
-- DROP TABLE line_chat_gap.acc_farmer 

        -- SELECT acc_farmer.id_farmer , acc_farmer.fullname , acc_farmer.img , MaxRowDate.CountFM  FROM acc_farmer , 
        --     (
        --         SELECT MAX(id_table) AS id_table , id_farmer , COUNT(id_farmer) AS CountFM , MAX(date_register) AS date_register
        --         FROM acc_farmer 
        --         WHERE station = "${result['data']['station_doctor']}" and register_auth = 0 
        --         GROUP BY id_farmer 
        --         ORDER BY date_register
        --     ) AS MaxRowDate
        -- WHERE acc_farmer.id_table = MaxRowDate.id_table LIMIT 30;