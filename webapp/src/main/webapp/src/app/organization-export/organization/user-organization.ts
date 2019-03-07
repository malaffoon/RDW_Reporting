import { District, Organization, School, SchoolGroup } from './organization';

/**
 * Represents the organizations the user is permitted to access exam results for
 */
export interface UserOrganizations {
  /**
   * All organizations entitled to the user
   */
  readonly organizations: Organization[];

  /**
   * All schools entitled to the user
   */
  readonly schools: School[];

  /**
   * All schools entitled to the user indexed by ID
   */
  readonly schoolsById: Map<number, School>;

  /**
   * All school groups entitled to the user
   */
  readonly schoolGroups: SchoolGroup[];

  /**
   * All school groups entitled to the user indexed by ID
   */
  readonly schoolGroupsById: Map<number, SchoolGroup>;

  /**
   * All districts entitled to the user
   */
  readonly districts: District[];

  /**
   * All districts entitled to the user indexed by ID
   */
  readonly districtsById: Map<number, District>;
}
