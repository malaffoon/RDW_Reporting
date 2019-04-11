import { Tree } from './tree';
import { District, Organization, SchoolGroup } from './organization';
import { createUserOrganizations } from './user-organizations';
import {
  createOrganizationTree,
  createOrganizationTreeWithPlaceholders
} from './organization-trees';
import { ordering } from '@kourge/ordering';
import { byString } from '@kourge/ordering/comparator';

describe('createOrganizationTree', () => {
  it('should create a tree representative of the given organizations', () => {
    const organizations = createUserOrganizations(
      [{ id: 1, districtId: 2 }],
      [],
      [{ id: 2 }]
    );
    const actual = createOrganizationTree(organizations);
    const expected = new Tree<Organization>();
    expected
      .create(organizations.districts[0])
      .create(organizations.schools[0]);

    expect(actual).toEqual(expected);
  });
});

describe('createOrganizationTreeWithPlaceholders', () => {
  it('should create a tree representative of the given organizations with placeholders when ancestors are absent', () => {
    const organizations = createUserOrganizations(
      [{ id: 1, districtId: 2 }, { id: 3 }],
      [],
      [{ id: 2 }]
    );
    const actual = createOrganizationTreeWithPlaceholders(
      [organizations.schools[0]],
      organizations
    );
    const expected = new Tree<Organization>();
    expected
      .create(organizations.districts[0])
      .create(new SchoolGroup())
      .create(organizations.schools[0]);

    expect(actual).toEqual(expected);
  });

  it('district placeholder should have an empty name', () => {
    const organizations = createUserOrganizations(
      [{ id: 1, districtId: 1, name: 'school1' }],
      [],
      []
    );
    const actual = createOrganizationTreeWithPlaceholders(
      [organizations.schools[0]],
      organizations
    );
    const districtPlaceholder = new District();
    districtPlaceholder.id = 1;

    const expected = new Tree<Organization>();
    expected
      .create(districtPlaceholder)
      .create(new SchoolGroup())
      .create(organizations.schools[0]);

    expect(actual.children[0].value.name).toBe('');
    expect(actual).toEqual(expected);
  });

  it('sort should not throw error for district placeholder', () => {
    const organizations = createUserOrganizations(
      [
        {
          id: 8,
          name: 'Keogh',
          naturalId: '88800130013004',
          organizationType: 'School',
          districtId: 2
        },
        {
          id: 1,
          name: 'Big Bay',
          naturalId: '88800120012001',
          organizationType: 'School',
          districtId: 1
        },
        {
          id: 6,
          name: 'Crom Hold',
          naturalId: '88800130013002',
          organizationType: 'School',
          districtId: 2
        },
        {
          id: 2,
          name: 'Igen Hold',
          naturalId: '88800120012002',
          organizationType: 'School',
          districtId: 1
        },
        {
          id: 3,
          name: 'Katz Field',
          naturalId: '88800120012003',
          organizationType: 'School',
          districtId: 1
        },
        {
          id: 7,
          name: 'Greenfields',
          naturalId: '88800130013003',
          organizationType: 'School',
          districtId: 2
        },
        {
          id: 9,
          name: 'Three Rivers',
          naturalId: '88800130013005',
          organizationType: 'School',
          districtId: 2
        },
        {
          id: 5,
          name: 'Camp Natalon',
          naturalId: '88800130013001',
          organizationType: 'School',
          districtId: 2
        },
        {
          id: 4,
          name: 'Tannercraft Hall',
          naturalId: '88800120012004',
          organizationType: 'School',
          districtId: 1
        }
      ],
      [],
      []
    );
    const actual = createOrganizationTreeWithPlaceholders(
      organizations.schools,
      organizations
    );

    expect(() =>
      actual.sort(ordering(byString).on(({ name }) => name).compare)
    ).not.toThrowError();
  });
});
