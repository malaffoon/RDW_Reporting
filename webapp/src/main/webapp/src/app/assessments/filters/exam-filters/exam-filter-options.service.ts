import { Injectable } from "@angular/core";
import { ExamFilterOptionsMapper } from "./exam-filter-options.mapper";
import { CachingDataService } from "../../../shared/data/caching-data.service";
import { ExamFilterOptions } from "../../model/exam-filter-options.model";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { ReportingServiceRoute } from '../../../shared/service-route';

const ServiceRoute = ReportingServiceRoute;

@Injectable()
export class ExamFilterOptionsService {

  constructor(private service: CachingDataService,
              private mapper: ExamFilterOptionsMapper) {
  }

  getExamFilterOptions(): Observable<ExamFilterOptions> {
    return this.service.get(`${ServiceRoute}/examFilterOptions`)
      .pipe(
        map(serverOptions => this.mapper.mapFromApi(serverOptions))
      );
  }
}
