import { Injectable } from "@angular/core";
import { School } from "../../user/model/school.model";
import { OrganizationMapper } from "./organization.mapper";

@Injectable()
export class OrganizationService {

  constructor(private mapper: OrganizationMapper) {
  }

  getSchoolsWithAncestry(schools: School[]): any[] {
    return schools.map(school => <any>{
      id: school.id,
      name: school.name,
      schoolId: school.id, // Allows Organization.isOrIsAncestorOf() method to work for schools
      // groupId: school.groupId,
      // groupName: school.groupName,
      districtId: school.districtId,
      districtName: school.districtName,
      // districtGroupId: school.districtGroupId,
      // districtGroupName: school.districtGroupName
    });
  }

}
