import { Injectable } from "@angular/core";
import { UserService } from "../user/user.service";
import { School } from "../user/model/school.model";
import { Observable } from "rxjs/Observable";
import { CachingDataService } from "../shared/cachingData.service";

@Injectable()
export class OrganizationService {

  private schoolsWithDistricts: Observable<School[]>;

  constructor(private userService: UserService,
              private dataService: CachingDataService) {
  }

  /**
   * Gets schools with district names.
   * This implementation caches the results for later calls.
   *
   * @returns {Observable<School[]>}
   */
  getSchoolsWithDistricts(): Observable<School[]> {
    if (this.schoolsWithDistricts) {
      console.log('cached');
      return this.schoolsWithDistricts;
    }
    console.log('no cache')
    return this.schoolsWithDistricts = Observable
      .forkJoin(
        this.userService.getCurrentUser(),
        this.getDistrictNamesById()
      )
      .map(response => {
        let [ user, districts ] = response;
        let res = user.schools.map(school => {
          school.districtName = districts.get(school.districtId);
          return school;
        });
        console.log('map res', res)
return res;
      });
  }

  private getDistrictNamesById() {
    return this.dataService
      .get('/organizations/districts')
      .map(districts => new Map<number, string>(districts.map(x => [ x.id, x.name ])));
  }
}
