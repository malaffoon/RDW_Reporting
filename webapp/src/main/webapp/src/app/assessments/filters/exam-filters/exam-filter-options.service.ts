import { Injectable } from "@angular/core";
import { ExamFilterOptionsMapper } from "./exam-filter-options.mapper";
import { CachingDataService } from "../../../shared/data/caching-data.service";

const ServiceRoute = '/reporting-service';

@Injectable()
export class ExamFilterOptionsService {

  constructor(private service: CachingDataService,
              private mapper: ExamFilterOptionsMapper) {
  }

  getExamFilterOptions() {
    return this.service
      .get(`${ServiceRoute}/examFilterOptions`)
      .map(x => this.mapper.mapFromApi(x));
  }
}
