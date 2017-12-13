-- ------------------------------------------ School/Districts --------------------------------------------------------------------------------------------------
INSERT INTO district (id, name) VALUES
  (-8, 'District-8'),
  (-9, 'District-9');

INSERT INTO school (id, district_id, name, update_import_id, migrate_id) VALUES
  (-8, -8, 'School-8', -1, -1),
  (-9, -9, 'School-9', -1, -1);

-- ------------------------------------------ Asmt ---------------------------------------------------------------------------------------------------------
INSERT INTO ica_asmt (id, grade_id, subject_id, school_year, name, update_import_id, migrate_id) VALUES
   (-8, -8, 1, 1999, 'asmt-8', -1, -1),
   (-9, -9, 2, 1999, 'asmt-9', -1, -1);

-- ------------------------------------------ Student and Groups  ------------------------------------------------------------------------------------------------
INSERT INTO student (id, gender_id, update_import_id, migrate_id) VALUES
   (-5, -8, -1, -1),
   (-6, -8, -1, -1),
   (-7, -9, -1, -1),
   (-8, -9, -1, -1),
   (-9, -9, -1, -1);

INSERT INTO student_ethnicity(student_id, ethnicity_id) values
    (-8,  -8),
    (-8,  -9),
    (-9,  -9);

-- ------------------------------------------ Exams ---------------------------------------------------------------------------------------------
INSERT INTO  fact_student_ica_exam (id, school_year, asmt_id, asmt_grade_id, completeness_id,
                                    administration_condition_id, performance_level,
                                    scale_score, scale_score_std_err, grade_id, student_id, school_id,
                                    iep, lep, section504, economic_disadvantage, migrant_status,
                                    claim1_scale_score, claim1_scale_score_std_err,claim1_category,
                                    claim2_scale_score, claim2_scale_score_std_err,claim2_category,
                                    claim3_scale_score, claim3_scale_score_std_err,claim3_category,
                                    claim4_scale_score, claim4_scale_score_std_err,claim4_category,
                                    completed_at, update_import_id, migrate_id) VALUES
  (-5, 1999, -8, -8, -9, -9, 1, 2500, 25, -8, -5, -8, true, true, false, false, true,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),
  (-6, 1999, -8, -8, -9, -9, 2, 2400, 24, -8, -6, -8, true, true, false, false, true,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),
  (-7, 1999, -8, -8, -9, -9, 3, 2300, 23, -8, -8, -8, true, true, false, false, true,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),
  (-8, 1999, -8, -8, -9, -9, 4, 2100, 21, -8, -9, -9, true, true, false, false, true,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),
  (-9, 1999, -8, -8, -9, -9, 1, 2000, 20, -8, -9, -9, true, true, false, false, true,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),

  (-10, 2000, -9, -9, -9, -9, 1, 2500, 17, -8, -9, -9, true, true, false, false, true,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),
  (-11, 2000, -9, -9, -9, -9, 1, 2500, 17, -8, -9, -9, true, true, false, false, true,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),
  (-12, 2000, -9, -9, -9, -9, 1, 2500, 17, -8, -9, -9, true, true, false, false, true,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),
  (-13, 2000, -9, -9, -9, -9, 1, 2500, 17, -8, -9, -9, true, true, false, false, true,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', -1, -1),
  (-14, 2000, -9, -9, -9, -9, 1, 2500, 17, -8, -9, -9, true, true, false, false, true,  2000, 0.11, 1, 2100, 0.12, 2, 2500, 0.13, 3, 3500, .15, 4, '2016-08-14 19:05:33.000000', -1, -1);
