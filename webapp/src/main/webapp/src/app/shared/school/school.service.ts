import { CachingDataService } from "../data/caching-data.service";
import { Injectable } from "@angular/core";
import { School } from "../organization/organization";
import { ReportingServiceRoute } from "../service-route";
import { Observable } from "rxjs";

@Injectable()
export class SchoolService {

  constructor(protected dataService: CachingDataService) {
  }

  getSchool(schoolId: number, limit?: number): Observable<School> {
    return this.dataService.get(`${ReportingServiceRoute}/schools/${schoolId}`)
  }
}
