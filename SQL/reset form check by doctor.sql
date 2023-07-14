DELETE FROM success_detail;
DELETE FROM report_detail;
DELETE FROM check_form_detail;
DELETE FROM check_plant_detail;

UPDATE formplant
SET submit = 0;