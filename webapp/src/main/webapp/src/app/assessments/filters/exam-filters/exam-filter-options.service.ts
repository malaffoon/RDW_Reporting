import { Injectable } from '@angular/core';
import { ExamFilterOptions } from '../../model/exam-filter-options.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExamSearchFilterService } from '../../../exam/service/exam-search-filter.service';
import { Filter } from '../../../exam/model/filter';

function findFilterValues(filters: Filter[], filterId: string): any[] {
  const filter = filters.find(({ id }) => id === filterId);
  return filter != null ? filter.values.slice() : [];
}

@Injectable()
export class ExamFilterOptionsService {
  constructor(private service: ExamSearchFilterService) {}

  // localize mapping to advanced filters?
  getExamFilterOptions(): Observable<ExamFilterOptions> {
    return this.service.getExamSearchFilters().pipe(
      map(filters => {
        const { schoolYears, subjects, studentFilters } = filters;
        // This mapping is a quick-adaptation approach to filling the functionality gap
        const options = new ExamFilterOptions();
        options.schoolYears = schoolYears.slice();
        options.ethnicities = findFilterValues(studentFilters, 'Ethnicity');
        options.genders = findFilterValues(studentFilters, 'Gender');
        options.elasCodes = findFilterValues(
          studentFilters,
          'EnglishLanguageAcquisitionStatus'
        );
        options.subjects = subjects.slice();
        options.languages = findFilterValues(studentFilters, 'PrimaryLanguage');
        options.militaryConnectedCodes = findFilterValues(
          studentFilters,
          'MilitaryStudentIdentifier'
        );
        options.studentFilters = studentFilters;
        return options;
      })
    );
  }
}
