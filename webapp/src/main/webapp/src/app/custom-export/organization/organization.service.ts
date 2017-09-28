import { Injectable } from "@angular/core";
import { School } from "../../user/model/school.model";
import { FlatSchool } from "./flat-school";

@Injectable()
export class OrganizationService {

  // TODO connect to API server
  // the final pass at this method will accept no arguments and return fully populated flat school models
  getSchoolsWithAncestry(schools: School[]): FlatSchool[] {
    return schools.map(school => <FlatSchool>{
      id: school.id,
      name: school.name,
      schoolId: school.id,
      // schoolGroupId: school.groupId,
      // schoolGroupName: school.groupName,
      districtId: school.districtId,
      districtName: school.districtName,
      // districtGroupId: school.districtGroupId,
      // districtGroupName: school.districtGroupName
    });
  }

}
