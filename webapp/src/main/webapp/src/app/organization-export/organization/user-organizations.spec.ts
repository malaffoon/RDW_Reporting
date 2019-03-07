import { Organization } from './organization';
import { UserOrganizations } from './user-organization';
import { createUserOrganizations } from './user-organizations';
import { createDistrict, createSchool } from './organizations';

describe('createUserOrganizations', () => {
  it('should not accept null args', () => {
    expect(() => createUserOrganizations(null, null, null)).toThrowError();
  });

  it('should create user organizations from provided organizations', () => {
    const schools = [{ id: 1, name: 'School A', districtId: 2 }].map(
        createSchool
      ),
      schoolGroups = [],
      districts: Organization[] = [{ id: 2, name: 'District A' }].map(
        createDistrict
      );

    const expected = <UserOrganizations>{
      organizations: [...districts, ...schools],
      schools: schools,
      schoolsById: new Map([[1, schools[0]]]),
      schoolGroups: schoolGroups,
      schoolGroupsById: new Map(),
      districts: districts,
      districtsById: new Map([[2, districts[0]]])
    };

    const actual = createUserOrganizations(schools, schoolGroups, districts);

    expect(actual).toEqual(expected);
  });
});
