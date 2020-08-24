import { Inject, Injectable, OnInit } from '@angular/core';
import { TestResultAvailability } from '../model/test-result-availability';
import { TestResultAvailabilityFilters } from '../model/test-result-availability-filters';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { TranslateDatePipe } from '../../../shared/i18n/translate-date.pipe';
import { AdminServiceRoute } from '../../../shared/service-route';
import {
  DATA_CONTEXT_URL,
  DataService
} from '../../../shared/data/data.service';
import { UserOptions } from '../model/user-options';
import { ResponseContentType } from '@angular/http';
import { EmbargoQueryType } from '../model/embargo-query-type';

const ResourceContext = `${AdminServiceRoute}/testResults`;
const ServiceRoute = `${AdminServiceRoute}/embargoes`;

@Injectable({
  providedIn: 'root'
})
export class TestResultsAvailabilityService implements OnInit {
  constructor(
    private dataService: DataService,
    private datePipe: TranslateDatePipe,
    private translate: TranslateService,
    @Inject(DATA_CONTEXT_URL) private contextUrl: string = '/api'
  ) {}

  static readonly NoFiltersNumeric = -1;
  static readonly NoFiltersText = 'All';

  static readonly FilterIncludeAll = {
    label: 'test-results-availability.all-text',
    value: null
  };

  private testResultFilters: TestResultAvailabilityFilters = new TestResultAvailabilityFilters();
  private defaultTestResultFilters = new TestResultAvailabilityFilters();

  successfulChange: boolean;

  private static toTestResultAvailability(source: any): TestResultAvailability {
    return {
      schoolYear: { label: '' + source.schoolYear, value: source.schoolYear },
      district: { label: source.districtName, value: source.districtId },
      subject: { label: source.subjectCode, value: source.subjectId },
      reportType: { label: source.reportType, value: source.reportType },
      status: { label: source.status, value: source.status },
      examCount: source.examCount
    };
  }

  private static toOptions(source: any): UserOptions {
    const statuses = source.statuses.map(stat => {
      return { label: stat, value: stat };
    });

    const sourceDistricts = source.districts || [];
    const districts = sourceDistricts.map(dist => {
      return { label: dist.name, value: dist.id };
    });

    return {
      viewAudit: source.viewAudit,
      districtAdmin: source.districtAdmin,
      districts: districts,
      statuses: statuses
    };
  }

  private static matchesFilters(
    testResult: TestResultAvailability,
    testResultFilters: TestResultAvailabilityFilters
  ) {
    // may need to adjust order
    return ['status', 'reportType', 'subject', 'district', 'schoolYear'].every(
      field => {
        return TestResultsAvailabilityService.isMatch(
          field,
          testResultFilters,
          testResult
        );
      }
    );
  }

  static isMatch(
    field: string,
    filters: TestResultAvailabilityFilters,
    testResult: TestResultAvailability
  ): boolean {
    return (
      filters[field] === TestResultsAvailabilityService.FilterIncludeAll ||
      filters[field].value === testResult[field].value
    );
  }

  ngOnInit(): void {
    this.setTestResultFilterDefaults();
    this.testResultFilters = this.getTestResultAvailabilityFilterDefaults();
  }

  formatAsLocalDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  // receive test results and apply filter's options
  getTestResults(
    testResultFilters: TestResultAvailabilityFilters,
    query: EmbargoQueryType
  ): Observable<TestResultAvailability[]> {
    // Default Sort order from query:
    // SchoolYear(D),District (by name) (A),Subject (by ID) (A), ReportType(A), Status(A)
    console.log('Post to data service');
    return this.dataService.post(`${ResourceContext}`, query).pipe(
      map((sourceTestResults: any[]) => {
        return sourceTestResults
          .map(r => TestResultsAvailabilityService.toTestResultAvailability(r))
          .filter(r =>
            TestResultsAvailabilityService.matchesFilters(r, testResultFilters)
          );
      })
    );
  }

  getUserOptions(): Observable<UserOptions> {
    return this.dataService.get(`${ResourceContext}/filters`).pipe(
      map((sourceUserSettings: any) => {
        return TestResultsAvailabilityService.toOptions(sourceUserSettings);
      })
    );
  }

  /**
   * Download embargo audit report CSV file.
   */
  openReport(): void {
    window.open(`${this.contextUrl}${ServiceRoute}/audit`, '_blank');
  }

  // TODO:  log changes and no need to persist
  changeTestResults(
    testResultFilters: TestResultAvailabilityFilters,
    newStatus: any
  ) {
    console.log('Change Request Log Info:', newStatus, testResultFilters);
    this.successfulChange = false;
    this.testResultFilters.status = newStatus;
    this.logTestResults(testResultFilters, newStatus.value);
    this.successfulChange = true;
  }

  // TODO: add save of data
  logTestResults(
    testResultFilters: TestResultAvailabilityFilters,
    newStatus: string
  ) {
    this.dataService
      .put(
        `${ResourceContext}`,
        {
          schoolYear: testResultFilters.schoolYear.value,
          district: testResultFilters.district.value,
          subject: testResultFilters.subject.value,
          reportType: testResultFilters.reportType.value,
          status: testResultFilters.status.value,
          newStatus: newStatus
        },
        { responseType: ResponseContentType.Text }
      )
      .pipe()
      .subscribe();
  }

  setTestResultFilterDefaults() {
    ['status', 'reportType', 'subject', 'district', 'schoolYear'].forEach(
      field => {
        this.defaultTestResultFilters[field] =
          TestResultsAvailabilityService.FilterIncludeAll;
      }
    );
  }

  getTestResultAvailabilityFilterDefaults(): TestResultAvailabilityFilters {
    return this.defaultTestResultFilters;
  }
}
