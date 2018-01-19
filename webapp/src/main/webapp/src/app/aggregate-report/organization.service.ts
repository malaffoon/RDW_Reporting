import { Injectable } from "@angular/core";
import { CachingDataService } from "../shared/data/caching-data.service";
import { Observable } from "rxjs/Observable";
import { Organization, School, District } from "./organization";

const ServiceRoute = '/aggregate-service';

@Injectable()
export class OrganizationService {

  constructor(private dataService: CachingDataService) {
  }

  findSchoolsAndDistrictsByName(name: string): Observable<Organization> {
    return this.dataService.get(`${ServiceRoute}/organizations`, { params: { name: name } })
      .map((organization) => {
        switch (organization.type) {
          case 'School':
            return <School>{
              id: organization.id,
              name: organization.name,
              districtId: organization.districtId
            };
          case 'District':
            return <District>{
              id: organization.id,
              name: organization.name
            };
        }
        throw new Error('Unexpected organization type: ' + organization.type);
      });
  }

}
