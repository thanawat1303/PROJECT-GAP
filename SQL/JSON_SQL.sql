-- -- INSERT INTO message_user
-- -- ( message , uid_line_farmer , id_read ) VALUES ( "ทดสอบข้อความ" , '?' , '{}');

-- SELECT * FROM `line_chat_gap`.`message_user` LIMIT 1000;

-- search read doctor
-- SELECT JSON_CONTAINS(id_read , '"read"' , '$."id_doctor"') , message_user.*
-- FROM message_user

-- update read doctor
-- UPDATE message_user
-- SET id_read = JSON_SET(id_read, '$."3"', 'read');