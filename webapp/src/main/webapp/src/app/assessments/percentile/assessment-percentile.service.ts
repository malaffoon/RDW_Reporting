import { Injectable } from "@angular/core";
import { DataService } from "../../shared/data/data.service";
import { Observable } from "rxjs/Observable";
import { ReportingServiceRoute } from "../../shared/service-route";
import { map } from "rxjs/operators";
import { Percentile } from "./assessment-percentile";
import { AssessmentExam } from "../model/assessment-exam.model";
import { AggregateReportRequestMapper } from "../../aggregate-report/aggregate-report-request.mapper";
import { AssessmentPercentileRequestMapper } from "./assessment-percentile-request.mapper";

@Injectable()
export class AssessmentPercentileService {

  constructor(private dataService: DataService,
              private requestMapper: AssessmentPercentileRequestMapper) {
  }

  getPercentiles(request: AssessmentPercentileRequest): Observable<Percentile[]> {
    return this.dataService.get(`${ReportingServiceRoute}/assessment-percentiles`, { params: request });
  }

  getPercentilesForAssessmentResults(results: AssessmentExam): Observable<Percentile[]> {
    return this.getPercentiles(this.requestMapper.fromAssessmentResults(results));
  }

}

export interface AssessmentPercentileRequest {
  assessmentId: number;
  startDate: string; // 'yyyy-MM-dd'
  endDate: string;
}
