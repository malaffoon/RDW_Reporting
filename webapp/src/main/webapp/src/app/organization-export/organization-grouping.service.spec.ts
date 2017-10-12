import { OrganizationMapper } from "./organization/organization.mapper";
import { District, School, SchoolGroup } from "./organization/organization";
import { OrganizationGroupingService } from "./organization-grouping.service";

describe('OrganizationGroupingService', () => {

  let mapper = new OrganizationMapper();
  let service: OrganizationGroupingService = new OrganizationGroupingService(mapper);
  let organizations = (() => {
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

  it('should return one school when one school of multi-school group/district', () => {
    expect(service.groupSelectedOrganizationIdsByType([
        organizations.schoolsById.get(1)
      ], organizations
    )).toEqual({
      districtIds: [],
      schoolGroupIds: [],
      schoolIds: [ 1 ]
    });
  });

  it('should return school group when all schools of group are selected', () => {
    expect(service.groupSelectedOrganizationIdsByType([
        organizations.schoolsById.get(1),
        organizations.schoolsById.get(2)
      ], organizations
    )).toEqual({
      districtIds: [],
      schoolGroupIds: [ 1 ],
      schoolIds: []
    });
  });

  it('should return district when all schools of the district are selected', () => {
    expect(service.groupSelectedOrganizationIdsByType([
        organizations.schoolsById.get(1),
        organizations.schoolsById.get(2),
        organizations.schoolsById.get(3),
      ], organizations
    )).toEqual({
      districtIds: [ 1 ],
      schoolGroupIds: [],
      schoolIds: []
    });
  });

});


