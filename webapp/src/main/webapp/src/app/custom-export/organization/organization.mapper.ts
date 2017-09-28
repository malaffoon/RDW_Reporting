import { Organization } from "./organization.model";
import { Injectable } from "@angular/core";
import { OrganizationType } from "./organization-type.enum";
import { Tree } from "./tree";
import { isUndefined } from "util";
import { FlatSchool } from "./flat-school";

@Injectable()
export class OrganizationMapper {

  districtGroup(value: FlatSchool): Organization {
    return {
      type: OrganizationType.DistrictGroup,
      isOrIsAncestorOf: (x: Organization): boolean => value.districtGroupId === x.districtGroupId,
      id: value.districtGroupId,
      name: value.districtGroupName,
      districtGroupId: value.districtGroupId
    };
  }

  district(value: FlatSchool): Organization {
    return {
      type: OrganizationType.District,
      isOrIsAncestorOf: (x: Organization): boolean => value.districtId === x.districtId,
      id: value.districtId,
      name: value.districtName,
      districtId: value.districtId,
      districtGroupId: value.districtGroupId
    };
  }

  schoolGroup(value: FlatSchool): Organization {
    return {
      type: OrganizationType.SchoolGroup,
      isOrIsAncestorOf: (x: Organization): boolean => value.schoolGroupId === x.schoolGroupId,
      id: value.schoolGroupId,
      name: value.schoolGroupName,
      schoolGroupId: value.schoolGroupId,
      districtId: value.districtId,
      districtGroupId: value.districtGroupId,
    };
  }

  school(value: FlatSchool): Organization {
    return {
      type: OrganizationType.School,
      isOrIsAncestorOf: (x: Organization): boolean => value.schoolId === x.schoolId,
      id: value.id,
      name: value.name,
      schoolId: value.id,
      schoolGroupId: value.schoolGroupId,
      districtId: value.districtId,
      districtGroupId: value.districtGroupId
    };
  }

  // real implementation will accept no params and
  // get /districtGroups, /districts, /schoolGroups, /schools
  // pre sorted to show district groups first, then districts etc...
  organizations(schools: FlatSchool[]): Organization[] {
    let organizations: Organization[] = [],
      districtGroups: Grouping<number, Organization> = new Grouping(organizations),
      districts: Grouping<number, Organization> = new Grouping(organizations),
      schoolGroups: Grouping<number, Organization> = new Grouping(organizations);

    schools.forEach(school => {
      districtGroups.computeIfAbsent(school.districtGroupId, () => this.districtGroup(school));
      districts.computeIfAbsent(school.districtId, () => this.district(school));
      schoolGroups.computeIfAbsent(school.schoolGroupId, () => this.schoolGroup(school));
      organizations.push(this.school(school));
    });
    return organizations;
  }

  organizationTree(schools: FlatSchool[]): Tree<Organization> {
    let root = new Tree<Organization>();
    schools.forEach(school => root
      .getOrCreate(x => x.id === school.districtGroupId, this.districtGroup(school))
      .getOrCreate(x => x.id === school.districtId, this.district(school))
      .getOrCreate(x => x.id === school.schoolGroupId, this.schoolGroup(school))
      .create(this.school(school))
    );
    return root;
  }

}

class Grouping<A, B> {

  private keys: Set<A> = new Set();

  constructor(private values: B[]) {
  }

  computeIfAbsent(key: A, factory: () => B): void {
    if (isUndefined(key) || this.keys.has(key)) {
      return;
    }
    this.keys.add(key);
    this.values.push(factory());
  }

}
