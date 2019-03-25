import { Tree } from './tree';
import { Organization, SchoolGroup } from './organization';
import { createUserOrganizations } from './user-organizations';
import {
  createOrganizationTree,
  createOrganizationTreeWithPlaceholders
} from './organization-trees';

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
});
