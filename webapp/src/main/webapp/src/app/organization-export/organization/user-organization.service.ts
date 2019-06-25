import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { createUserOrganizations } from './user-organizations';
import { CachingDataService } from '../../shared/data/caching-data.service';
import { map } from 'rxjs/operators';
import { OrganizationService } from '../../shared/organization/organization.service';
import { UserOrganizations } from './user-organization';

@Injectable({
  providedIn: 'root'
})
export class UserOrganizationService extends OrganizationService {
  constructor(protected dataService: CachingDataService) {
    super(dataService);
  }

  /**
   * Gets the all organizations entitled to the user and groups them by type
   * Because the component caches the schools and doesn't go back to the server
   * during type-ahead search or when adding districts/groups, this needs to
   * get *every* school for the user. So use a large limit (20000 is more schools
   * than any single state has so it should be enough even for a state user).
   */
  getUserOrganizations(): Observable<UserOrganizations> {
    return forkJoin(
      this.getSchools(20000),
      this.getSchoolGroups(),
      this.getDistricts()
    ).pipe(
      map(([schools, schoolGroups, districts]) => {
        return createUserOrganizations(schools, schoolGroups, districts);
      })
    );
  }
}
