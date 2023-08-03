SELECT acc_farmer.id_table , acc_farmer.img , acc_farmer.fullname , acc_farmer.link_user , acc_farmer.date_register
    , farmer_main.Count , acc_farmer.date_doctor_confirm , acc_farmer.uid_line ,
(
    SELECT fullname_doctor
    FROM acc_doctor
    WHERE acc_doctor.id_table_doctor = acc_farmer.id_doctor
) as name_doctor 
,
(
    SELECT EXISTS (
        SELECT uid_line
        FROM message_user 
        , 
        (
            SELECT uid_line
            FROM acc_farmer as farmer_check
            WHERE farmer_check.link_user = acc_farmer.link_user
            ORDER BY date_register DESC
            LIMIT 1
        ) as farmer
        WHERE message_user.uid_line_farmer = farmer.uid_line
                and COALESCE(JSON_CONTAINS(id_read , '"read"' , '$."2"') , 0) = 0
        GROUP BY uid_line
    )
) as is_msg
FROM acc_farmer , 
(
    SELECT MAX(date_register) as DateLast , link_user , COUNT(link_user) as Count
    FROM acc_farmer 
    WHERE station = "6" and register_auth = 1
    GROUP BY link_user
) as farmer_main
WHERE acc_farmer.link_user = farmer_main.link_user 
    and acc_farmer.date_register = farmer_main.DateLast
ORDER BY date_register DESC
-- LIMIT ${Limit};

    -- link_user