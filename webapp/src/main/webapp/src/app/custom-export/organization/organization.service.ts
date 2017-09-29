import { Injectable } from "@angular/core";
import { FlatSchool } from "./flat-school";
import { Observable } from "rxjs/Observable";
import { CachingDataService } from "app/shared/cachingData.service";

@Injectable()
export class OrganizationService {

  constructor(private dataService: CachingDataService) {
  }

  getSchoolsWithAncestry(): Observable<FlatSchool[]> {
    return Observable.forkJoin(
      this.getSchools(),
      this.getSchoolGroups(),
      this.getDistricts(),
      this.getDistrictGroups()
    ).map(response => {

      let [ schools, schoolGroups, districts, districtGroups ] = response,
        schoolGroupNamesById = new Map<number, any>(schoolGroups.map(x => <any>[ x.id, x.name ])),
        districtNamesById = new Map<number, any>(districts.map(x => <any>[ x.id, x.name ])),
        districtGroupNamesById = new Map<number, any>(districtGroups.map(x => <any>[ x.id, x.name ]));

      return schools.map(school => <FlatSchool>{
        id: school.id,
        name: school.name,
        schoolId: school.id,
        schoolGroupId: school.schoolGroupId,
        schoolGroupName: schoolGroupNamesById.get(school.schoolGroupId),
        districtId: school.districtId,
        districtName: districtNamesById.get(school.districtId),
        districtGroupId: school.districtGroupId,
        districtGroupName: districtGroupNamesById.get(school.districtGroupId)
      });
    });
  }

  private getSchools(): Observable<any[]> {
    return this.dataService.get('/organizations/schools');
  }

  private getSchoolGroups(): Observable<any[]> {
    return this.dataService.get('/organizations/schoolGroups');
  }

  private getDistricts(): Observable<any[]> {
    return this.dataService.get('/organizations/districts');
  }

  private getDistrictGroups(): Observable<any[]> {
    return this.dataService.get('/organizations/districtGroups');
  }

}
