import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { AggregateReportOptions } from "./aggregate-report-options";
import { CachingDataService } from "../shared/data/caching-data.service";

const ServiceRoute = '/aggregate-service';

@Injectable()
export class AggregateReportOptionsService {

  constructor(private dataService: CachingDataService) {
  }

  getReportOptions(): Observable<AggregateReportOptions> {
    return this.dataService.get(`${ServiceRoute}/reportOptions`)
      .map(options => <AggregateReportOptions>{
        assessmentGrades: options.assessmentGrades,
        assessmentTypes: options.assessmentTypes,
        completenesses: [
          {id: 2, code: 'Complete'},
          {id: 1, code: 'Partial'}
        ],
        ethnicities: options.ethnicities,
        genders: options.genders,
        interimAdministrationConditions: [
          {id: 2, code: 'SD'},
          {id: 3, code: 'NS'}
        ],
        schoolYears: options.schoolYears,
        subjects: options.subjects,
        summativeAdministrationConditions: [
          {id: 1, code: 'Valid'},
          {id: 4, code: 'IN'}
        ]
      });
  }

}
