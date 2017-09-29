import { Organization } from "./organization";
import { Injectable } from "@angular/core";
import { OrganizationType } from "./organization-type.enum";
import { Tree } from "./tree";
import { Option } from "../../shared/form/search-select";
import { UserOrganizations } from "./user-organizations";

@Injectable()
export class OrganizationMapper {

  readonly nullDistrict: Organization = this.district({});
  readonly nullSchoolGroup: Organization = this.schoolGroup({});

  district(value: any): Organization {
    return {
      uuid: this.districtUuid(value.id),
      type: OrganizationType.District,
      isOrIsAncestorOf: x => value.id === x.districtId,
      id: value.id,
      name: value.name,
      districtId: value.id
    };
  }

  schoolGroup(value: any): Organization {
    return {
      uuid: this.schoolGroupUuid(value.id),
      type: OrganizationType.SchoolGroup,
      isOrIsAncestorOf: x => value.id === x.schoolGroupId,
      id: value.id,
      name: value.name,
      schoolGroupId: value.id,
      districtId: value.districtId
    };
  }

  school(value: any): Organization {
    return {
      uuid: this.schoolUuid(value.id),
      type: OrganizationType.School,
      isOrIsAncestorOf: x => value.id === x.schoolId,
      id: value.id,
      name: value.name,
      schoolId: value.id,
      schoolGroupId: value.schoolGroupId,
      districtId: value.districtId
    };
  }

  options(schools: Organization[], optionsByUuid: Map<string, Option>): Option[] {
    let options: Option[] = [],
      districts: Grouping<string, Option> = new Grouping(options),
      schoolGroups: Grouping<string, Option> = new Grouping(options);

    schools.forEach(school => {
      let districtUuid = this.districtUuid(school.districtId),
        schoolGroupUuid = this.schoolGroupUuid(school.schoolGroupId),
        schoolUuid = school.uuid;

      school.districtId && districts.computeIfAbsent(districtUuid, () => optionsByUuid.get(districtUuid));
      school.schoolGroupId && schoolGroups.computeIfAbsent(schoolGroupUuid, () => optionsByUuid.get(schoolGroupUuid));
      options.push(optionsByUuid.get(schoolUuid));
    });
    return options;
  }

  organizationTree(schools: Organization[], organizations: UserOrganizations): Tree<Organization> {
    let root = new Tree<Organization>();
    schools.forEach(school => root
        .getOrCreate(x => x.id === school.districtId, organizations.districtsById.get(school.districtId))
        .getOrCreate(x => x.id === school.schoolGroupId, organizations.schoolGroupsById.get(school.schoolGroupId))
        .create(school)
    );
    return root;
  }

  /**
   * @param {OrganizationType} type the organization type
   * @param {number} id the organization entity ID (these can collide because schools, districts etc. are modeled as unique entities by the API)
   * @returns {string} <type_number>-<id_number>
   */
  private organizationUuid(type: OrganizationType, id: number): string {
    return `${type}-${id}`;
  }

  private districtUuid(id: number): string {
    return this.organizationUuid(OrganizationType.District, id);
  }

  private schoolGroupUuid(id: number): string {
    return this.organizationUuid(OrganizationType.SchoolGroup, id);
  }

  private schoolUuid(id: number): string {
    return this.organizationUuid(OrganizationType.School, id);
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