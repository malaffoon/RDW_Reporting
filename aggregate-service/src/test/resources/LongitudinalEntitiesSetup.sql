-- because of the nature of the SQL, we need the real grade ids and codes.
INSERT INTO grade(id, code) SELECT * FROM(
    SELECT 3, '03'
    UNION SELECT 4, '04'
    UNION SELECT 5, '05'
    UNION SELECT 6, '06'
    UNION SELECT 7, '07'
    UNION SELECT 8, '08'
    UNION SELECT 11, '11'
    ) AS tmp (id, code)
WHERE NOT EXISTS (
  --ignore anything that has already been inserted
      SELECT 1 FROM grade g WHERE g.id = tmp.id
);

INSERT INTO elas (id, code) VALUES (-11, 'EL'), (-14, 'RFEP');
INSERT INTO completeness (id, code) VALUES (-9, 'Complete'), (-8, 'Partial');
INSERT INTO administration_condition VALUES (-99,'IN'),(-98,'SD'),(-97,'NS'),(-96,'Valid');
INSERT INTO ethnicity VALUES (-29,'ethnicity-29'),(-28,'ethnicity-28'),(-27, 'ethnicity-27'), (-26, 'ethnicity-26');
INSERT INTO gender VALUES (-19,'gender-19'),(-18,'gender-18');
INSERT INTO school_year VALUES (1999),(2000),(2001);

-- ------------------------------------------ School/Districts --------------------------------------------------------------------------------------------------
INSERT INTO district (id, name, natural_id, external_id, migrate_id) VALUES
  (-17, 'District-7', 'id-7', 'externalId-7', -1),
  (-18, 'District-8', 'id-8', 'externalId-8', -1),
  (-19, 'District-9', 'id-9', 'externalId-9', -1);

INSERT INTO school (id, district_group_id, district_id, school_group_id, name, natural_id, external_id, embargo_enabled, updated, update_import_id, migrate_id) VALUES
  (-7, -1, -17, -1, 'School-7', 'id-7', 'externalId-7', 1, '2016-08-14 19:05:33.000000', -1, -1),
  (-8, -1, -18, -1, 'School-8', 'id-8', 'externalId-8', 1, '2016-08-14 19:05:33.000000', -1, -1),
  (-9, -1, -19, -1, 'School-9', 'id-9', 'externalId-9', 1, '2016-08-14 19:05:33.000000', -1, -1),
  (-10, -1, -19, -1, 'School-10','id-10', 'externalId-10', 1, '2016-08-14 19:05:33.000000', -1, -1);

-- ------------------------------------------ Asmt ---------------------------------------------------------------------------------------------------------
INSERT INTO asmt (id, grade_id, subject_id, type_id, school_year, name, label, updated, update_import_id, migrate_id) VALUES
  (-3,   3, 2, 3, 1999,  'asmt-3',  'asmt-3',  '2016-08-14 19:05:33.000000', -1, -1),
  (-5,   4, 1, 3, 1999,  'asmt-4',  'asmt-4',  '2016-08-14 19:05:33.000000', -1, -1),
  (-8,   5, 1, 3, 1999,  'asmt-5',  'asmt-5',  '2016-08-14 19:05:33.000000', -1, -1),
  (-18,  6, 1, 3, 2000,  'asmt-6',  'asmt-6',  '2016-08-14 19:05:33.000000', -1, -1),
  (-9,   7, 2, 3, 2000,  'asmt-7',  'asmt-7',  '2016-08-14 19:05:33.000000', -1, -1),
  (-10,  8, 2, 3, 2000,  'asmt-8',  'asmt-8','  2016-08-14 19:05:33.000000', -1, -1),
  (-11, 11, 2, 3, 20001, 'asmt-11', 'asmt-11', '2016-08-14 19:05:33.000000', -1, -1);
