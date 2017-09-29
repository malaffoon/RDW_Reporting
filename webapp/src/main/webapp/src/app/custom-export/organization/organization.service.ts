import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { CachingDataService } from "app/shared/cachingData.service";
import { UserOrganizations } from "./user-organizations";
import { Organization } from "./organization";
import { OrganizationMapper } from "./organization.mapper";

@Injectable()
export class OrganizationService {

  constructor(private dataService: CachingDataService,
              private mapper: OrganizationMapper) {
  }

  /**
   * Gets the all organizations entitled to the user and groups them by type
   *
   * @returns {Observable<UserOrganizations>}
   */
  getUserOrganizations(): Observable<UserOrganizations> {
    return Observable.forkJoin(
      this.getSchools(),
      this.getSchoolGroups(),
      this.getDistricts()
    ).map(response => {

      let [ remoteSchools, remoteSchoolGroups, remoteDistricts ] = response,
        schools = remoteSchools.map(x => this.mapper.school(x)),
        schoolGroups = remoteSchoolGroups.map(x => this.mapper.schoolGroup(x)).concat(this.mapper.nullSchoolGroup),
        districts = remoteDistricts.map(x => this.mapper.district(x)).concat(this.mapper.nullDistrict);

      return {
        organizations: [ ...districts, ...schoolGroups, ...schools ],
        schools: schools,
        schoolGroups: schoolGroups,
        schoolGroupsById: new Map<number, Organization>(schoolGroups.map(x => <any>[ x.id, x ])),
        districts: districts,
        districtsById: new Map<number, Organization>(districts.map(x => <any>[ x.id, x ]))
      }
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

}
