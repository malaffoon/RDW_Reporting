import { Organization } from "./organization";
import { Injectable } from "@angular/core";
import { OrganizationType } from "./organization-type.enum";
import { Tree } from "./tree";
import { Option } from "../../shared/form/search-select";
import { UserOrganizations } from "./user-organizations";
import { isUndefined } from "util";

@Injectable()
export class OrganizationMapper {

  readonly nullDistrict: Organization = this.createDistrict({});
  readonly nullSchoolGroup: Organization = this.createSchoolGroup({});

  createDistrict(value: any): Organization {
    return {
      uuid: this.createDistrictUuid(value.id),
      type: OrganizationType.District,
      isOrIsAncestorOf: x => value.id === x.districtId,
      id: value.id,
      name: value.name,
      districtId: value.id
    };
  }

  createSchoolGroup(value: any): Organization {
    return {
      uuid: this.createSchoolGroupUuid(value.id),
      type: OrganizationType.SchoolGroup,
      isOrIsAncestorOf: x => value.id === x.schoolGroupId,
      id: value.id,
      name: value.name,
      schoolGroupId: value.id,
      districtId: value.districtId
    };
  }

  createSchool(value: any): Organization {
    return {
      uuid: this.createSchoolUuid(value.id),
      type: OrganizationType.School,
      isOrIsAncestorOf: x => value.id === x.schoolId,
      id: value.id,
      name: value.name,
      schoolId: value.id,
      schoolGroupId: value.schoolGroupId,
      districtId: value.districtId
    };
  }

  /**
   * Creates organization options for selection.
   *
   * @param {Organization[]} schools
   * @param {Map<string, Option>} optionsByUuid
   * @returns {Option[]}
   */
  createOptions(schools: Organization[], optionsByUuid: Map<string, Option>): Option[] {
    let options: Option[] = [],
      districts: Grouping<string, Option> = new Grouping(options),
      schoolGroups: Grouping<string, Option> = new Grouping(options);

    schools.forEach(school => {
      let districtUuid = this.createDistrictUuid(school.districtId),
        schoolGroupUuid = this.createSchoolGroupUuid(school.schoolGroupId),
        schoolUuid = school.uuid;

      school.districtId && districts.computeIfAbsent(districtUuid, () => optionsByUuid.get(districtUuid));
      school.schoolGroupId && schoolGroups.computeIfAbsent(schoolGroupUuid, () => optionsByUuid.get(schoolGroupUuid));
      options.push(optionsByUuid.get(schoolUuid));
    });
    return options;
  }

  /**
   * Creates organization hierarchy for the given schools and master set of organizations.
   * This method will add placeholder ancestor nodes to the school when then school group or createDistrict ID is undefined.
   *
   * @param {Organization[]} schools the schools to create the hierarchy with
   * @param {UserOrganizations} organizations master set of organizations to draw into the tree when referenced by the school's ancestor IDs
   * @returns {Tree<Organization>}
   */
  createOrganizationTreeWithPlaceholders(schools: Organization[], organizations: UserOrganizations): Tree<Organization> {
    let root = new Tree<Organization>();
    schools.forEach(school => root
        .getOrCreate(x => x.id === school.districtId, organizations.districtsById.get(school.districtId))
        .getOrCreate(x => x.id === school.schoolGroupId, organizations.schoolGroupsById.get(school.schoolGroupId))
        .create(school)
    );
    return root;
  }

  /**
   * Creates organization hierarchy with the given organizations.
   *
   * @param {UserOrganizations} organizations master set of organizations to create the tree from
   * @returns {Tree<Organization>} organization hierarchy
   */
  createOrganizationTree(organizations: UserOrganizations): Tree<Organization> {
    let root = new Tree<Organization>();
    organizations.schools.forEach(school => {
      let node = root;
      if (!isUndefined(school.districtId)) {
        node = node.getOrCreate(x => x.id === school.districtId, organizations.districtsById.get(school.districtId))
      }
      if (!isUndefined(school.schoolGroupId)) {
        node = node.getOrCreate(x => x.id === school.schoolGroupId, organizations.schoolGroupsById.get(school.schoolGroupId))
      }
      node.create(school);
    });
    return root;
  }

  /**
   * @param {OrganizationType} type the organization type
   * @param {number} id the organization entity ID (these can collide because schools, districts etc. are modeled as unique entities by the API)
   * @returns {string} <type_number>-<id_number>
   */
  private createOrganizationUuid(type: OrganizationType, id: number): string {
    return `${type}-${id}`;
  }

  private createDistrictUuid(id: number): string {
    return this.createOrganizationUuid(OrganizationType.District, id);
  }

  private createSchoolGroupUuid(id: number): string {
    return this.createOrganizationUuid(OrganizationType.SchoolGroup, id);
  }

  private createSchoolUuid(id: number): string {
    return this.createOrganizationUuid(OrganizationType.School, id);
  }

}

/**
 * Helper which prevents redundancy from occurring in the expanded set of organizations
 */
class Grouping<A, B> {

  private keys: Set<A> = new Set();

  constructor(private values: B[]) {
  }

  /**
   * Appends the result of the provided factory method to the given array if the key is not present
   *
   * @param {A} key the ID used to check for presence
   * @param {() => B} factory the result of this method will be added to the array
   */
  computeIfAbsent(key: A, factory: () => B): void {
    if (!this.keys.has(key)) {
      this.keys.add(key);
      this.values.push(factory());
    }
  }

}
