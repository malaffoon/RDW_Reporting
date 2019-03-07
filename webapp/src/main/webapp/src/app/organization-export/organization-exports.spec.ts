import { Organization } from './organization/organization';
import { Option } from '../shared/form/sb-typeahead.component';
import { createOptions } from './organization-exports';
import { createUserOrganizations } from './organization/user-organizations';

describe('createOptions', () => {
  it('should infer and expand schools into their containing groups and districts if present', () => {
    const organizations = createUserOrganizations(
      [{ id: 1, districtId: 2 }],
      [],
      [{ id: 2 }]
    );
    const toOption = (org: Organization) =>
      <any>{ value: org, group: '', label: org.name };
    const optionsByUuid = new Map<string, Option>(
      organizations.organizations.map(x => <any>[x.uuid, toOption(x)])
    );
    const options = createOptions(organizations.schools, optionsByUuid);

    expect(options).toEqual([
      toOption(organizations.districts[0]),
      toOption(organizations.schools[0])
    ]);
  });
});
