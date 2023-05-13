-- SELECT id_table , UNIX_TIMESTAMP(date_register) , UNIX_TIMESTAMP("2023-05-13T16:31:13.000Z") FROM line_chat_gap.acc_farmer 
-- WHERE 
--  id_table=7 and id_farmer='1164' and UNIX_TIMESTAMP(date_register)=UNIX_TIMESTAMP('2023-05-13T16:31:13.000Z') and register_auth = 0

-- and id_farmer='1163' and date_register = DATE_FORMAT('2023-05-13T08:24:38.000Z' , '%Y-%m-%d') and register_auth = 0
-- '2023-05-13T08:24:19.000Z'
-- 1683969861


-- UPDATE line_chat_gap.acc_farmer SET register_auth=0 , id_docter='' 
-- WHERE id_table=7 and id_farmer='1164' and UNIX_TIMESTAMP(date_register)=UNIX_TIMESTAMP("2023-05-13T16:31:13") 
-- and register_auth = 0