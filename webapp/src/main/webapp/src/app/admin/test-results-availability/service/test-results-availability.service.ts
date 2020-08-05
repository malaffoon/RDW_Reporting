import { Injectable, OnInit } from '@angular/core';
import { TestResultAvailability } from '../model/test-result-availability';
import { TestResultAvailabilityFilters } from '../model/test-result-availability-filters';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Download } from '../../../shared/data/download.model';
import { Http, ResponseContentType } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { TranslateDatePipe } from '../../../shared/i18n/translate-date.pipe';
import { AdminServiceRoute } from '../../../shared/service-route';
import { DataService } from '../../../shared/data/data.service';
import { UserOptions } from '../model/user-options';

const ResourceContext = `${AdminServiceRoute}/testResults`;

@Injectable({
  providedIn: 'root'
})
export class TestResultsAvailabilityService implements OnInit {
  constructor(
    private dataService: DataService,
    private datePipe: TranslateDatePipe,
    private http: Http,
    private translate: TranslateService
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

    return {
      statuses: statuses,
      singleDistrictAdmin: source.singleDistrictAdmin,
      district: {
        label: source.districtName,
        value: source.districtId
      }
    };
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
    testResultFilters: TestResultAvailabilityFilters
  ): Observable<TestResultAvailability[]> {
    // Default Sort order from query:
    // SchoolYear(D),District (by name) (A),Subject (by ID) (A), ReportType(A), Status(A)
    return this.dataService.get(`${ResourceContext}`).pipe(
      map((sourceTestResults: any[]) => {
        return sourceTestResults
          .map(r => TestResultsAvailabilityService.toTestResultAvailability(r))
          .filter(r => this.matchesFilters(r, testResultFilters));
      })
    );
  }

  getUserOptions(): Observable<UserOptions> {
    // TODO: implement. This is stubbed out now.
    const fromDataService = of({
      statuses: ['Loading', 'Reviewing', 'Released'],
      singleDistrictAdmin: false,
      districtId: 2,
      districtName: 'Crom District'
    });

    return fromDataService.pipe(
      map((sourceUserSettings: any) => {
        return TestResultsAvailabilityService.toOptions(sourceUserSettings);
      })
    );
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
      .subscribe(t => console.log("It's away"));
  }

  setTestResultFilterDefaults() {
    ['status', 'reportType', 'subject', 'district', 'schoolYear'].forEach(
      field => {
        this.defaultTestResultFilters[field] =
          TestResultsAvailabilityService.FilterIncludeAll;
      }
    );
    // TODO: set from session if District Admin
    // this.defaultTestResultFilters.district = TestResultsAvailabilityService.FilterIncludeAll;
  }

  getTestResultAvailabilityFilterDefaults(): TestResultAvailabilityFilters {
    return this.defaultTestResultFilters;
  }

  private matchesFilters(
    testResult: TestResultAvailability,
    testResultFilters: TestResultAvailabilityFilters
  ) {
    // may need to adjust order
    return ['status', 'reportType', 'subject', 'district', 'schoolYear'].every(
      field => {
        return this.isMatch(field, testResultFilters, testResult);
      }
    );
  }

  private isMatch(
    field: string,
    filters: TestResultAvailabilityFilters,
    testResult: TestResultAvailability
  ): boolean {
    return (
      filters[field] === TestResultsAvailabilityService.FilterIncludeAll ||
      filters[field].value === testResult[field].value
    );
  }

  generateAuditHistory() {
    // determine what can be returned
  }

  public getTemplateFile(): Observable<any> {
    // TODO: Replace with call to real file location
    return this.http
      .get('/assets/testResultsAudit202006041.csv')
      .pipe(
        map(
          response =>
            new Download(
              `${this.translate.instant(
                'test-results-availability.audit-filename'
              )}.csv`,
              new Blob([response.text()], { type: 'text/csv; charset=utf-8' })
            )
        )
      );
  }
}
