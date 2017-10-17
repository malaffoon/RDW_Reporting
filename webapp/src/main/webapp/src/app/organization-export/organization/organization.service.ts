import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { CachingDataService } from "app/shared/cachingData.service";
import { UserOrganizations } from "./user-organizations";
import { OrganizationMapper } from "./organization.mapper";
import { UserService } from "../../user/user.service";

@Injectable()
export class OrganizationService {

  constructor(private dataService: CachingDataService,
              private userService: UserService,
              private mapper: OrganizationMapper) {
  }

  /**
   * Gets the all organizations entitled to the user and groups them by type
   *
   * @returns {Observable<UserOrganizations>}
   */
  getUserOrganizations(): Observable<UserOrganizations> {
    return Observable.forkJoin(
      this.userService.getCurrentUser(),
      this.getSchoolGroups(),
      this.getDistricts()
    ).map(response => {
      let [ user, schoolGroups, districts ] = response;

      let schools = user.schools;
      for (let i = 0; i < 10; i++) {
        schools = schools.concat(schools);
      }

      return this.mapper.createUserOrganizations(user.schools, schoolGroups, districts);
      // return this.mapper.createUserOrganizations(schools, schoolGroups, districts);
    });
  }

  private getSchoolGroups(): Observable<any[]> {
    return this.dataService.get('/organizations/schoolGroups');
  }

  private getDistricts(): Observable<any[]> {
    return this.dataService.get('/organizations/districts');
  }

}
