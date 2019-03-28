import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CachingDataService } from '../../shared/data/caching-data.service';
import { ReportingServiceRoute } from '../../shared/service-route';
import { map } from 'rxjs/operators';
import {
  ExamSearchFilters,
  toExamSearchFilters
} from '../model/exam-search-filters';

const ResourceRoute = `${ReportingServiceRoute}/examSearchFilters`;

@Injectable({
  providedIn: 'root'
})
export class ExamSearchFilterService {
  constructor(private dataService: CachingDataService) {}

  getExamSearchFilters(): Observable<ExamSearchFilters> {
    return this.dataService
      .get(ResourceRoute)
      .pipe(map(serverFilters => toExamSearchFilters(serverFilters)));
  }
}
