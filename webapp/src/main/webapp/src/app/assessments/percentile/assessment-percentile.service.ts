import { Injectable } from "@angular/core";
import { DataService } from "../../shared/data/data.service";
import { Observable } from "rxjs/Observable";
import { ReportingServiceRoute } from "../../shared/service-route";
import { map } from "rxjs/operators";
import { Percentile } from "./assessment-percentile";

@Injectable()
export class AssessmentPercentileService {

  constructor(private dataService: DataService) {
  }

  getPercentiles(request: AssessmentPercentileRequest): Observable<Percentile[]> {
    return this.dataService.get(`${ReportingServiceRoute}/assessment-percentiles`, { params: request })
      .pipe(map(percentiles => percentiles));
  }

}

export interface AssessmentPercentileRequest {
  assessmentId: number;
  startDate: Date;
  endDate: Date;
}
