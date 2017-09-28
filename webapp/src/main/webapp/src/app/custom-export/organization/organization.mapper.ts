import { Organization } from "./organization.model";
import { School } from "../../user/model/school.model";
import { Injectable } from "@angular/core";
import { OrganizationType } from "./organization-type.enum";
import { isNullOrUndefined } from "util";

const nullOrUndefinedTo = (value: any, defaultValue: any) => isNullOrUndefined(value) ? defaultValue : value;
const safeId = (value: number): number => nullOrUndefinedTo(value, undefined);

@Injectable()
export class OrganizationMapper {

  // real implementation will accept no params and
  // get /districtGroups, /districts, /schoolGroups, /schools
  // and return as flat array
  getOrganizations(schools: any[]): Organization[] {
    let groupers = [
      new SchoolGrouper(),
      new SchoolGroupGrouper(),
      new DistrictGrouper(),
      new DistrictGroupGrouper()
    ];
    return schools.reduce((organizations: Organization[], value: any): Organization[] => {
      groupers.forEach((group) => group.group(organizations, value));
      return organizations;
    }, []);
  }

  districtGroup(organization: Organization) {
    return new DistrictGroupGrouper().createOrganization(organization);
  }

  district(organization: Organization) {
    return new DistrictGrouper().createOrganization(organization);
  }

  schoolGroup(organization: Organization) {
    return new SchoolGroupGrouper().createOrganization(organization);
  }

  school(organization: Organization) {
    return new SchoolGrouper().createOrganization(organization);
  }

}

interface OrganizationGrouper {

  getOrganizationId(value: any): number;

  createOrganization(school: any): any;

  group(organizations: Organization[], school: School): void;

}

abstract class AbstractGrouper implements OrganizationGrouper {

  private keys: Set<number> = new Set();

  abstract getOrganizationId(value: any): number;

  abstract createOrganization(value: any): Organization;

  group(organizations: Organization[], school: School): void {
    let id: number = this.getOrganizationId(school);
    if (id && !this.keys.has(id)) {
      this.keys.add(id);
      organizations.push(this.createOrganization(school));
    }
  }

}

class SchoolGrouper extends AbstractGrouper {

  getOrganizationId(value: any): number {
    return value.id;
  }

  createOrganization(value: any): any {
    return {
      type: OrganizationType.School,
      has: ((x: any): boolean => value.id === x.schoolId),
      id: value.id,
      name: value.name,
      schoolId: value.id,
      schoolGroupId: safeId(value.groupId),
      districtId: safeId(value.districtId),
      districtGroupId: safeId(value.districtGroupId)
    };
  }

  group(organizations: Organization[], school: School): void {
    organizations.push(this.createOrganization(school));
  }

}

class SchoolGroupGrouper extends AbstractGrouper {

  getOrganizationId(value: any): number {
    return value.groupId;
  }

  createOrganization(value: any): any {
    return {
      type: OrganizationType.SchoolGroup,
      has: ((x: any): boolean => value.schoolGroupId === x.schoolGroupId),
      id: safeId(value.groupId),
      name: value.groupName,
      schoolGroupId: safeId(value.groupId),
      districtId: safeId(value.districtId),
      districtGroupId: safeId(value.districtGroupId),
    };
  }
}

class DistrictGrouper extends AbstractGrouper {

  getOrganizationId(value: any): number {
    return value.districtId;
  }

  createOrganization(value: any): any {
    return {
      type: OrganizationType.District,
      has: ((x: any): boolean => value.districtId === x.districtId),
      id: safeId(value.districtId),
      name: value.districtName,
      districtId: safeId(value.districtId),
      districtGroupId: safeId(value.districtGroupId)
    };
  }

}

class DistrictGroupGrouper extends AbstractGrouper {

  getOrganizationId(value: any): number {
    return value.districtGroupId;
  }

  createOrganization(value: any): any {
    return {
      type: OrganizationType.DistrictGroup,
      has: ((x: any): boolean => value.districtGroupId === x.districtGroupId),
      id: safeId(value.districtGroupId),
      name: value.districtGroupName,
      districtGroupId: safeId(value.districtGroupId)
    };
  }

}
