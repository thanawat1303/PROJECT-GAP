SELECT formplant.id_plant , formplant.type_plant , formplant.date_plant ,
acc_farmer.id_farmer , acc_farmer.fullname   
FROM formplant , 
    (
        SELECT id_farmer , uid_line , fullname FROM acc_farmer 
        WHERE station = "ราชมงคล" and register_auth = 1
    ) AS acc_farmer
WHERE formplant.id_uid_line = acc_farmer.uid_line and formplant.submit_plant=0
ORDER BY date_plant 