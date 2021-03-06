INSERT INTO grade (id, code, sequence) VALUES (-3, '-3', 3), (-4, '-4', 4), (-5, '-5', 5), (-6, '-6', 6);
INSERT INTO completeness (id, code) VALUES (-9, 'Complete'), (-8, 'Partial');
INSERT INTO administration_condition VALUES (-99, 'IN'), (-98, 'SD'), (-97, 'NS'), (-96, 'Valid');
INSERT INTO ethnicity VALUES (-29, 'ethnicity-29'), (-28, 'ethnicity-28'), (-27, 'ethnicity-27'), (-26, 'ethnicity-26');
INSERT INTO elas (id, code) VALUES (-11, 'EL'), (-14, 'RFEP');
INSERT INTO military_connected (id, code) VALUES (-15, 'Active'), (-16, 'Reserve');
INSERT INTO language (id, code) VALUES (-21, 'abc'), (-22, 'cba');
INSERT INTO gender VALUES (-19, 'gender-19'), (-18, 'gender-18');
INSERT INTO school_year VALUES (1997), (1999), (2000), (2001);

-- ------------------------------------------ School/Districts --------------------------------------------------------------------------------------------------
INSERT INTO district (id, name, natural_id, external_id, migrate_id) VALUES
  (-18, 'District-8', 'id-8', 'externalId-8', -1),
  (-19, 'District-9', 'id-9', 'externalId-9', -1);

INSERT INTO school (id, district_group_id, district_id, school_group_id, name, natural_id, external_id, embargo_enabled, updated, update_import_id, migrate_id) VALUES
  (-7, -1, -18, -1, 'School-7', 'id-7', 'externalId-7', 1, '2016-08-14 19:05:33.000000', -1, -1),
  (-8, -1, -19, -1, 'School-8', 'id-8', 'externalId-8', 1, '2016-08-14 19:05:33.000000', -1, -1),
  (-9, -1, -19, -1, 'School-9', 'id-9', 'externalId-9', 1, '2016-08-14 19:05:33.000000', -1, -1);

-- ------------------------------------------ Asmt ---------------------------------------------------------------------------------------------------------
INSERT INTO asmt (id, grade_id, subject_id, type_id, school_year, name, label, cut_point_1, cut_point_2, cut_point_3,min_score, max_score, updated, update_import_id, migrate_id) VALUES
  (-3,  -3, 1, 3, 1997, 'asmt-3', 'asmt-3', 2300, 2500, 2700, 2000, 2800, '2016-08-14 19:05:33.000000', -1, -1),
  (-31, -3, 1, 3, 1996, 'asmt-31', 'asmt-31', 2300, 2500, 2700, 2000, 2800, '2016-08-14 19:05:33.000000', -1, -1),
  (-4,  -4, 1, 3, 1998, 'asmt-4', 'asmt-4', 2300, 2500, 2700, 2000, 2800, '2016-08-14 19:05:33.000000', -1, -1),
  (-5,  -5, 1, 3, 1999, 'asmt-5', 'asmt-5', 2300, 2500, 2700, 2000, 2800, '2016-08-14 19:05:33.000000', -1, -1),
  (-6,  -6, 1, 3, 2000, 'asmt-61', 'asmt-6', 2300, 2500, 2700, 2000, 2800, '2016-08-14 19:05:33.000000', -1, -1),
  (-61, -6, 1, 3, 1999, 'asmt-7', 'asmt-61', 2300, 2500, 2700, 2000, 2800, '2016-08-14 19:05:33.000000', -1, -1);

INSERT INTO asmt_active_year(asmt_id, school_year) VALUES
    (-3,  1997),
    (-31, 1997),
    (-4,  1998),
    (-5,  1999),
    (-6,  2000),
    (-6,  1999),
    (-61, 1999);

-- ------------------------------------------ Student and Groups  ------------------------------------------------------------------------------------------------
INSERT INTO student (id, gender_id, updated, update_import_id, migrate_id) VALUES
  (-100, -18, '2016-08-14 19:05:33.000000', -1, -1),
  (-101, -18, '2016-08-14 19:05:33.000000', -1, -1),
  (-102, -18, '2016-08-14 19:05:33.000000', -1, -1),
  (-103, -19, '2016-08-14 19:05:33.000000', -1, -1),
  (-104, -19, '2016-08-14 19:05:33.000000', -1, -1),
  (-105, -19, '2016-08-14 19:05:33.000000', -1, -1),
  (-150, -19, '2016-08-14 19:05:33.000000', -1, -1),
  (-200, -19, '2016-08-14 19:05:33.000000', -1, -1);

  INSERT INTO student_ethnicity(student_id, ethnicity_id) values
  (-100,  -28),
  (-100,  -29),
  (-101,  -29);

-- ------------------------------------------ Exams ---------------------------------------------------------------------------------------------
INSERT INTO exam_longitudinal (id, school_year, school_year_asmt_grade_code, asmt_id, asmt_grade_id, subject_id, grade_id, student_id, school_id,
                                            completeness_id, administration_condition_id, performance_level,
                                            scale_score, elas_id, military_connected_id, language_id,
                                            iep, lep, section504, economic_disadvantage, migrant_status,
                                            completed_at, updated, update_import_id, migrate_id) VALUES
  -- school -9 , district -19: over years
  -- id represents - the last digit of year, school id (one digit) + student id
  (-79100, 1997, '1997,-3',  -3,  -3, 1, -3, -100, -9, -8, -98, 1, 2500, -11, -15, -21, 1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-79102, 1997, '1997,-3',  -3,  -3, 1, -3, -102, -9, -9, -98, 2, 2400, -14, -16, -21, 0, 1, 0, 1, 0, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-79103, 1997, '1997,-3',  -3,  -3, 1, -3, -103, -9, -9, -99, 3, 2300, -14, -16, -21, 1, 1, 1, 0, 0, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-79104, 1997, '1997,-3',  -3,  -3, 1, -3, -104, -9, -9, -99, 4, 2100, -11, -15, -21, 0, 1, 2, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-79105, 1997, '1997,-3',  -31, -3, 1, -3, -105, -9, -9, -99, 1, 2000, -11, -15, -21, 1, 0, 0, 0, 2, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-79106, 1997, '1997,-4',  -4, - 4, 1, -4, -150, -9, -9, -99, 1, 2097, -11, -15, -21, 1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),

  (-89100, 1998, '1998,-4', -4, -4, 1, -4, -100, -9, -8, -98, 1, 2500, -11, -15, -21, 1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  --  student -102 left the school
  (-89103, 1998, '1998,-4', -4, -4, 1, -4, -103, -9, -9, -99, 3, 2300, -11, -15, -21, 1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-89104, 1998, '1998,-4', -4, -4, 1, -4, -104, -9, -9, -99, 4, 2100, -11, -15, -21, 0, 1, 2, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-89105, 1998, '1998,-4', -4, -4, 1, -4, -105, -9, -9, -99, 1, 2000, -11, -15, -21, 1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-99106, 1998, '1998,-5', -5, -5, 1, -5, -150, -9, -9, -99, 1, 2098, -11, -15, -21, 1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),


  (-99100, 1999, '1999,-5', -5, -5, 1, -5, -100, -9, -8, -98, 1, 2100, -11, -15, -21, 1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-99102, 1999, '1999,-5', -5, -5, 1, -5, -102, -9, -9, -98, 2, 2120, -11, -15, -21, 0, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  --  student -103 left the district, student -102 came back
  (-99104, 1999, '1999,-5', -5, -5, 1, -5, -104, -9, -9, -99, 4, 2140, -11, -15, -21, 0, 1, 2, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-99105, 1999, '1999,-5', -5, -5, 1, -5, -105, -9, -9, -99, 1, 2150, -11, -15, -21, 1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-99150, 1999, '1999,-6', -6, -6, 1, -6, -150, -9, -9, -99, 1, 2099, -11, -15, -21, 1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),

  -- school -8, district -19: over year
  (-88102, 1998, '1998,-4', -4, -4, 1, -4, -102, -8, -8, -98, 1, 2500, -11, -15, -21, 1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),

  -- school -7, different district
  (-77200, 1997, '1997,-3', -3, -3, 1, -3, -200, -7, -9, -98, 1, 2500, -11, -15, -21, 1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-77101, 1997, '1997,-3', -3, -3, 1, -3, -101, -7, -9, -98, 1, 2500, -11, -15, -21, 1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),

  (-87200, 1998, '1998,-4', -4, -4, 1, -4, -200, -7, -9, -98, 1, 2500, -11, -15, -21, 1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),

  (-97200, 1999, '1999,-5', -5, -5, 1, -5, -200, -7, -9, -98, 1, 2200, -11, -15, -21, 1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1),
  (-97103, 1999, '1999,-5', -5, -5, 1, -5, -103, -7, -9, -98, 1, 2103, -11, -15, -21, 1, 1, 0, 0, 1, '2016-08-14 19:05:33.000000', '2016-09-14 19:05:33.000000', -1, -1);
