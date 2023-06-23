DROP TABLE line_chat_gap.editForm;
DROP TABLE line_chat_gap.detailEdit;
CREATE TABLE line_chat_gap.editForm ( 
    id_edit INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_form varchar(50) NOT NULL , -- id of form main
    id_doctor varchar(50) NOT NULL,
    because varchar(100) NOT NULL , -- เหตุผลการแก้ไข
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    note varchar(100) NOT NULL , -- หมายเหตุของผู้ส่งเสริม
    status INT NOT NULL ,
    type_form varchar(10) NOT NULL
);

CREATE TABLE line_chat_gap.detailEdit (
    id_detail INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_edit INT NOT NULL,
    subject_form varchar(20) NOT NULL , -- subject of content on the form / หัวข้อที่ถูกแก้ไขเนื้อหาในฟอร์ม เช่น หัวข้อ พื้นที่
    old_content varchar(100) NOT NULL -- this content was edit / ข้อมูลที่ถูกแก้ไข โดยข้อมูลปัจจุบันจะถูกบันทึกลงในฟอร์ม
);

-- ALTER TABLE line_chat_gap.editFormPlant
-- RENAME TO editForm

-- ALTER TABLE line_chat_gap.editForm
-- MODIFY COLUMN status INT NOT NULL;

-- ALTER TABLE line_chat_gap.detailEdit
-- MODIFY COLUMN subject_form varchar(20) NOT NULL

-- table form plant main edit