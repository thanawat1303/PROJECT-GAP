CREATE TABLE line_chat_gap.editFormPlant ( 
    id_edit INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_form_edit varchar(50) NOT NULL , -- id of form main
    id_doctor_scan varchar(50) NOT NULL,
    subject_form INT NOT NULL , -- subject of content on the form / หัวข้อที่ถูกแก้ไขเนื้อหาในฟอร์ม เช่น หัวข้อ พื้นที่
    content_edit varchar(100) NOT NULL , -- this content was edit / ข้อมูลที่ถูกแก้ไข โดยข้อมูลปัจจุบันจะถูกบันทึกลงในฟอร์ม
    because_edit varchar(100) NOT NULL , -- เหตุผลการแก้ไข
    date_edit DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    note_edit varchar(100) NOT NULL -- หมายเหตุของผู้ส่งเสริม
);

-- table form plant main edit