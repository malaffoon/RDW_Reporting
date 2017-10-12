import { OrganizationMapper } from "./organization/organization.mapper";
import { District, School, SchoolGroup } from "./organization/organization";
import { OrganizationExportNamingService } from "./organization-export-naming.service";

describe('OrganizationExportNamingService', () => {

  let service: OrganizationExportNamingService = new OrganizationExportNamingService();
  let organizations = (() => {

    let mapper = new OrganizationMapper();

    let schools: School[] = [
        { id: 1, name: 'School 1', schoolGroupId: 1, districtId: 1 },
        { id: 2, name: 'School 2', schoolGroupId: 1, districtId: 1 },
        { id: 3, name: 'School 3', schoolGroupId: 2, districtId: 1 },
        { id: 4, name: 'School 4', districtId: 2 },
        { id: 5, name: 'School 5', districtId: 2 }
      ].map(x => mapper.createSchool(x)),
      schoolGroups: SchoolGroup[] = [
        { id: 1, name: 'School Group 1', districtId: 1 },
        { id: 2, name: 'School Group 2', districtId: 1 },
        { id: 3, name: 'School Group 3', districtId: 2 }
      ].map(x => mapper.createSchoolGroup(x)),
      districts: District[] = [
        { id: 1, name: 'District 1' },
        { id: 2, name: 'District 2' }
      ].map(x => mapper.createDistrict(x));

    return {
      organizations: [ ...districts, ...schoolGroups, ...schools ],
      schools: schools,
      schoolsById: new Map<number, School>(schools.map(x => <any>[ x.id, x ])),
      schoolGroups: schoolGroups,
      schoolGroupsById: new Map<number, SchoolGroup>(schoolGroups.map(x => <any>[ x.id, x ])),
      districts: districts,
      districtsById: new Map<number, District>(districts.map(x => <any>[ x.id, x ]))
    };
  })();

  it('should return school year as name when there is no selection', () => {
    let options = {
      schoolYear: 1000,
      schoolIds: [],
      schoolGroupIds: [],
      districtIds: []
    };
    expect(service.name(options, organizations))
      .toBe(`${options.schoolYear}`);
  });

  it('should return school name when one school', () => {
    let options = {
      schoolYear: 1000,
      schoolIds: [ 1 ],
      schoolGroupIds: [],
      districtIds: []
    };
    expect(service.name(options, organizations))
      .toBe(`${organizations.schoolsById.get(1).name} ${options.schoolYear}`);
  });

  it('should return school group name when two schools of same group', () => {
    let options = {
      schoolYear: 1000,
      schoolIds: [ 1, 2 ],
      schoolGroupIds: [],
      districtIds: []
    };
    expect(service.name(options, organizations))
      .toBe(`${organizations.schoolGroupsById.get(1).name} ${options.schoolYear}`);
  });

  it('should return district name when two schools of different group', () => {
    let options = {
      schoolYear: 1000,
      schoolIds: [ 1, 3 ],
      schoolGroupIds: [],
      districtIds: []
    };
    expect(service.name(options, organizations))
      .toBe(`${organizations.districtsById.get(1).name} ${options.schoolYear}`);
  });

  it('should return school group name when one school group', () => {
    let options = {
      schoolYear: 1000,
      schoolIds: [],
      schoolGroupIds: [ 1 ],
      districtIds: []
    };
    expect(service.name(options, organizations))
      .toBe(`${organizations.schoolGroupsById.get(1).name} ${options.schoolYear}`);
  });

  it('should return district name when multiple school groups', () => {
    let options = {
      schoolYear: 1000,
      schoolIds: [],
      schoolGroupIds: [ 1, 2 ],
      districtIds: []
    };
    expect(service.name(options, organizations))
      .toBe(`${organizations.districtsById.get(1).name} ${options.schoolYear}`);
  });

  it('should return district name when school group and schools are selected', () => {
    let options = {
      schoolYear: 1000,
      schoolIds: [ 1 ],
      schoolGroupIds: [ 2 ],
      districtIds: []
    };
    expect(service.name(options, organizations))
      .toBe(`${organizations.districtsById.get(1).name} ${options.schoolYear}`);
  });

  it('should return district name when one district', () => {
    let options = {
      schoolYear: 1000,
      schoolIds: [],
      schoolGroupIds: [],
      districtIds: [ 1 ]
    };
    expect(service.name(options, organizations))
      .toBe(`${organizations.districtsById.get(1).name} ${options.schoolYear}`);
  });

});


