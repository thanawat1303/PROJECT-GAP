SELECT 
(
    SELECT COUNT(formfertilizer.id_plant)
    FROM formfertilizer
    WHERE form.id = formfertilizer.id_plant
) as ctFer , 
(
    SELECT COUNT(formchemical.id_plant)
    FROM formchemical
    WHERE form.id = formchemical.id_plant
) as Ctche , form.*
FROM 
(
    SELECT formplant.* , House.id_farmer , House.fullname   
    FROM formplant , 
        (
            SELECT id_farm_house , acc_farmer.id_farmer , acc_farmer.fullname 
            FROM housefarm , 
                (
                    SELECT id_farmer , uid_line , fullname FROM acc_farmer 
                    WHERE station = "3" and register_auth = "0"
                ) AS acc_farmer
            WHERE (housefarm.uid_line = acc_farmer.uid_line) or (housefarm.id_farmer = acc_farmer.id_farmer)
        ) as House
    WHERE House.id_farm_house = formplant.id_farm_house and formplant.state_status="0"
    ORDER BY date_plant 
    LIMIT 30
) as form