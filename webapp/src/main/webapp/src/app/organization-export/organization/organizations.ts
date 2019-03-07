import { District, School, SchoolGroup } from './organization';

export function createDistrict(value: any = {}): District {
  const district = new District();
  district.id = value.id;
  district.name = value.name;
  return district;
}

export function createSchoolGroup(value: any = {}): SchoolGroup {
  const schoolGroup = new SchoolGroup();
  schoolGroup.id = value.id;
  schoolGroup.name = value.name;
  schoolGroup.districtId = value.districtId;
  return schoolGroup;
}

export function createSchool(value: any = {}): School {
  const school = new School();
  school.id = value.id;
  school.name = value.name;
  school.schoolGroupId = value.schoolGroupId;
  school.districtId = value.districtId;
  return school;
}
