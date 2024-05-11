ALTER TABLE line_chat_gap.acc_doctor
MODIFY COLUMN id_table_doctor VARCHAR(10) NOT NULL;

ALTER TABLE line_chat_gap.acc_farmer
MODIFY COLUMN id_table_doctor VARCHAR(10) NOT NULL;

ALTER TABLE line_chat_gap.because_delete
MODIFY COLUMN id_table_doctor VARCHAR(10) NOT NULL;

ALTER TABLE line_chat_gap.because_status
MODIFY COLUMN id_table_doctor VARCHAR(10) NOT NULL;

ALTER TABLE line_chat_gap.check_form_detail
MODIFY COLUMN id_table_doctor VARCHAR(10) NOT NULL;

ALTER TABLE line_chat_gap.check_plant_detail
MODIFY COLUMN id_table_doctor VARCHAR(10) NOT NULL;

ALTER TABLE line_chat_gap.report_detail
MODIFY COLUMN id_table_doctor VARCHAR(10) NOT NULL;

ALTER TABLE line_chat_gap.acc_doctor
  ADD PRIMARY KEY (`id_table_doctor`);