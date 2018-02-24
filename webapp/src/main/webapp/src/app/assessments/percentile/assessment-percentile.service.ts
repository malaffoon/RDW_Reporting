import { Injectable } from "@angular/core";
import { DataService } from "../../shared/data/data.service";
import { Observable } from "rxjs/Observable";
import { ReportingServiceRoute } from "../../shared/service-route";
import { Percentile, PercentileScore } from "./assessment-percentile";
import { DatePipe } from "@angular/common";
import { delay } from "rxjs/operators";
import { of } from "rxjs/observable/of";

@Injectable()
export class AssessmentPercentileService {

  constructor(private dataService: DataService,
              private datePipe: DatePipe) {
  }

  getPercentiles(request: AssessmentPercentileRequest): Observable<Percentile[]> {
    // return this.dataService
    //   .get(`${ReportingServiceRoute}/assessment-percentiles`, {
    //     params: this.toServerRequest(request)
    //   });

    const result = [
      {
        assessmentId: 1,
        startDate: new Date(),
        endDate: new Date(),
        count: 100,
        mean: 50,
        standardDeviation: 25,
        scores: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
          .map(input => <PercentileScore>{rank: input * 5, score: input * 100})
      }
    ];

    return of(result).pipe(delay(500));
  }

  private toServerRequest(request: AssessmentPercentileRequest): AssessmentPercentileServerRequest {
    return {
      assessmentId: request.assessmentId,
      startDate: this.formatAsLocalDate(request.from),
      endDate: this.formatAsLocalDate(request.to)
    };
  }

  private formatAsLocalDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

}

export interface AssessmentPercentileRequest {
  assessmentId: number;
  from: Date;
  to: Date;
}

interface AssessmentPercentileServerRequest {
  assessmentId: number;
  startDate: string;
  endDate: string;
}
