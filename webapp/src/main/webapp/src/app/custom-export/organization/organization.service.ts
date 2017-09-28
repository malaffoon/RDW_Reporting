import { Injectable } from "@angular/core";
import { School } from "../../user/model/school.model";

@Injectable()
export class OrganizationService {

  getOrganizations(schools: School[]): any[] {
    return schools.map(school => <any>{
      id: school.id,
      name: school.name,
      schoolId: school.id, // for has() method - alternative is fork in has logic
      // groupId: school.groupId,
      // groupName: school.groupName,
      districtId: school.districtId,
      districtName: school.districtName,
      // districtGroupId: school.districtGroupId,
      // districtGroupName: school.districtGroupName
    });
  }

}
