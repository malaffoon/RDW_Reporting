import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../shared/notification/notification.service';
import { TestResultAvailability } from './model/test-result-availability';
import { TestResultsAvailabilityService } from './service/test-results-availability.service';
import { TestResultAvailabilityFilters } from './model/test-result-availability-filters';
import { TestResultsAvailabilityChangeStatusModal } from './test-results-availability-change-status.modal';
import { Download } from '../../shared/data/download.model';
import { saveAs } from 'file-saver';
import { UserService } from '../../shared/security/service/user.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserOptions } from './model/user-options';

class Column {
  id: string; // en.json name
  field: string; // TestResult field
  sortable: boolean;

  constructor({ id, field = '', sortable = true }) {
    this.id = id;
    this.field = field ? field : id;
    this.sortable = sortable;
  }
}

@Component({
  selector: 'test-results',
  templateUrl: './test-results-availability.component.html'
})
export class TestResultsAvailabilityComponent
  implements OnInit, AfterViewInit, DoCheck {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private testResultsService: TestResultsAvailabilityService,
    private translate: TranslateService,
    private userService: UserService
  ) {}

  @ViewChild('alertSuccess')
  alertSuccess: ElementRef;

  @ViewChild('alertFailure')
  alertFailure: ElementRef;

  private grabFocusToAlert = false;

  columns: Column[] = [
    new Column({ id: 'school-year', field: 'schoolYear' }),
    new Column({ id: 'district', field: 'district' }),
    new Column({ id: 'subject', field: 'subject' }),
    new Column({ id: 'report-type', field: 'reportType' }),
    new Column({ id: 'result-count', field: 'examCount', sortable: false }),
    new Column({ id: 'status' })
  ];

  changeResultsTooltip = `${this.translate.instant(
    'test-results-availability.change-results-tooltip'
  )}`;
  // 'Change status of selected test results availability (all pages).';
  testResultAvailabilityFilters: TestResultAvailabilityFilters;
  filteredTestResults$: Observable<TestResultAvailability[]>;
  filteredData$: Observable<any[]>;
  filteredResultsEmpty$: Observable<boolean>;
  userOptions$: Observable<UserOptions>;

  // Used to determine what to display
  userDistrict: { label: string; value: number }; // when it's a district admin
  showDistrictFilter: boolean; // set false if districtAdmin
  showAudit: boolean; // only DevOps has ability
  state: string; // state of tenant or sandbox logged into
  numOfRows: number = 20; // TODO: set to be configurable

  // results of change request
  successfulChange: boolean;
  unableToChange: boolean;

  schoolYearOptions$: Observable<{ label: string; value: any }[]>;
  districtOptions$: Observable<{ label: string; value: any }[]>;
  subjectOptions$: Observable<{ label: string; value: any }[]>;
  reportTypeOptions$: Observable<{ label: string; value: any }[]>;
  statusOptions$: Observable<{ label: string; value: any }[]>;

  statusTransitionOptions$: Observable<{ label: string; value: any }[]>;

  isDistrictAdmin$: Observable<boolean>;
  district$: Observable<{ label: string; value: number }>;

  // need to save each selected Option to filtered Group
  successChangeMsgOptions: string;

  private toSubjectKey = label => 'subject.' + label + '.name';
  private toReportTypeKey = label =>
    'test-results-availability.reportType.' + label;
  private toStatusKey = label => 'test-results-availability.status.' + label;

  openChangeResultsModal() {
    this.userService
      .getUser()
      .pipe(map(user => user.sandboxUser))
      .subscribe(sandboxUser => {
        const modalReference: BsModalRef = this.modalService.show(
          TestResultsAvailabilityChangeStatusModal,
          {}
        );
        const modal: TestResultsAvailabilityChangeStatusModal =
          modalReference.content;
        modal.selectedFilters = this.testResultAvailabilityFilters;

        this.statusTransitionOptions$.subscribe(
          options => (modal.statusOptions = options)
        );

        // For fully-privileged users (all three status options), default to Reviewing. For others, default
        // to Released. Handle degenerative cases, although these should not occur.
        switch (modal.statusOptions.length) {
          case 0:
            modal.selectedStatus = null;
            break;
          case 1:
            modal.selectedStatus = modal.statusOptions[0];
            break;
          default:
            modal.selectedStatus = modal.statusOptions[1];
            break;
        }

        modal.sandboxUser = sandboxUser;
        modal.changeStatusEvent.subscribe(res => {
          this.changeSuccessful(res.data, res.error);
          this.changeFailed(res.error);
        });
      });
  }

  ngOnInit() {
    this.userService
      .getUser()
      .pipe(map(user => user.tenantName))
      .subscribe(tenantName => {
        this.state = tenantName;
      });

    // TODO: get from user settings
    this.showAudit = false;

    // Data for Drop downs
    // set defaults - needed since this component is initialized first
    this.testResultsService.setTestResultFilterDefaults();
    this.testResultAvailabilityFilters = this.testResultsService.getTestResultAvailabilityFilterDefaults();

    this.userOptions$ = this.testResultsService.getUserOptions();
    this.isDistrictAdmin$ = this.userOptions$.pipe(
      map(user => user.singleDistrictAdmin)
    );

    this.userOptions$.subscribe(u => console.log(u));

    this.district$ = this.userOptions$.pipe(
      map(user => {
        const district = user.singleDistrictAdmin ? user.district : null;
        if (district != null) {
          this.testResultAvailabilityFilters.district = district;
        }
        return district;
      })
    );

    this.updateFilteredTestResults();
    this.updateFilters();
  }

  updateFilteredTestResults() {
    this.filteredTestResults$ = this.testResultsService.getTestResults(
      this.testResultAvailabilityFilters
    );

    this.filteredResultsEmpty$ = this.filteredTestResults$.pipe(
      map(results => results.length === 0)
    );

    this.filteredData$ = this.filteredTestResults$.pipe(
      map(results => {
        return results.map(result => {
          return {
            schoolYear: result.schoolYear.label,
            district: result.district.label,
            subject: this.translate.instant(
              this.toSubjectKey(result.subject.label)
            ),
            status: this.translate.instant(
              this.toStatusKey(result.status.label)
            ),
            reportType: this.translate.instant(
              this.toReportTypeKey(result.reportType.label)
            ),
            examCount: result.examCount,
            statusValue: result.status.value
          };
        });
      })
    );
  }

  private getOptionsByField(field: string, toTranslateKey = label => label) {
    const sort = 'label';
    return this.filteredTestResults$.pipe(
      map((results: TestResultAvailability[]) => {
        const ids = results.map(r => r[field].value);
        const options = results
          .map(r => {
            return {
              label: toTranslateKey(r[field].label),
              value: r[field].value
            };
          })
          .filter((item, idx) => ids.indexOf(item.value) === idx)
          .sort((a, b) => a[sort].localeCompare(b[sort]));

        options.unshift(TestResultsAvailabilityService.FilterIncludeAll);

        return options;
      })
    );
  }

  private updateFilters() {
    this.schoolYearOptions$ = this.getOptionsByField('schoolYear');
    this.districtOptions$ = this.getOptionsByField('district');
    this.subjectOptions$ = this.getOptionsByField('subject', this.toSubjectKey);
    this.reportTypeOptions$ = this.getOptionsByField(
      'reportType',
      this.toReportTypeKey
    );

    // Status is done differently since it is possible for not all available statuses to exist in the data.
    this.statusTransitionOptions$ = this.userOptions$.pipe(
      map((user: UserOptions) => {
        return user.statuses.map(stat => {
          return { label: this.toStatusKey(stat.label), value: stat.value };
        });
      })
    );

    this.statusOptions$ = this.statusTransitionOptions$.pipe(
      map((options: any[]) => {
        // Copy array of options and prepend the "All" option used in filter selector
        const allOptions = [...options];
        allOptions.unshift(TestResultsAvailabilityService.FilterIncludeAll);

        return allOptions;
      })
    );
  }

  onChangeSchoolYearFilter(schoolYear: any) {
    this.testResultAvailabilityFilters.schoolYear = schoolYear;
    this.updateFilteredTestResults();
  }

  onChangeDistrictFilter(district: any) {
    this.testResultAvailabilityFilters.district = district;
    this.updateFilteredTestResults();
  }

  onChangeSubjectFilter(subject: any) {
    this.testResultAvailabilityFilters.subject = subject;
    this.updateFilteredTestResults();
  }

  onChangeReportTypeFilter(reportType: any) {
    this.testResultAvailabilityFilters.reportType = reportType;
    this.updateFilteredTestResults();
  }

  onChangeStatusFilter(status: any) {
    this.testResultAvailabilityFilters.status = status;
    this.updateFilteredTestResults();
  }

  testResultsRowStyleClass(rowData: any) {
    return rowData.statusValue === 'Loading'
      ? 'loadingColor'
      : rowData.statusValue === 'Reviewing'
      ? 'reviewingColor'
      : 'releasedColor';
  }

  downloadAuditFile(): void {
    // replace download file name with date info
    const now = this.testResultsService.formatAsLocalDate(new Date());
    const auditFilename =
      `${this.translate.instant('test-results-availability.audit-filename')}_` +
      now +
      `.csv`;
    this.testResultsService.getTemplateFile().subscribe(
      (download: Download) => {
        saveAs(download.content, auditFilename);
      },
      (error: Error) => {
        console.error(error);
      }
    );
  }

  closeSuccessAlert() {
    this.successfulChange = false;
  }

  closeErrorAlert() {
    this.unableToChange = false;
  }

  private changeSuccessful(data: string, error: boolean) {
    if (error) {
      this.changeFailed(error);
      this.successfulChange = false;
    } else {
      this.successChangeMsgOptions = data;
      this.successfulChange = true;
      this.alertFailure = null;
      this.grabFocusToAlert = true;
    }
  }

  private changeFailed(error: any) {
    this.unableToChange = error;
    if (this.unableToChange) {
      this.alertSuccess = null;
      this.successfulChange = false;
      this.grabFocusToAlert = true;
    }
  }

  /* tslint:disable */
  ngAfterViewInit() {
    // TODO: upgrade to newer version of PrimeNG and then remove this.
    // Hack to label the pagination controls, which the version of p-table we are using doesn't support.
    eval(
      "jQuery('a.ui-paginator-first').attr('aria-label', 'Go to first page')"
    );
    eval(
      "jQuery('a.ui-paginator-prev').attr('aria-label', 'Go to previous page')"
    );
    eval("jQuery('a.ui-paginator-next').attr('aria-label', 'Go to next page')");
    eval("jQuery('a.ui-paginator-last').attr('aria-label', 'Go to last page')");

    // New T-Base recommendation to add "Page" to the page number for screen readers. Not sure if even the new PrimeNG
    // will support this.
    eval(
      "jQuery('a.ui-paginator-page').each(function( index ) { $( this ).attr('aria-label', 'Page ' + (index+1) );});"
    );
  }
  /* tslint:enable */

  ngDoCheck(): void {
    // Change focus to alert when it first appears.
    // Seems like a kludge. Is there a more elegant way to fit it into the lifecycle?
    if (this.alertSuccess && this.grabFocusToAlert) {
      this.alertSuccess.nativeElement.focus();
      this.grabFocusToAlert = false;
    } else if (this.alertFailure && this.grabFocusToAlert) {
      this.alertFailure.nativeElement.focus();
      this.grabFocusToAlert = false;
    }
  }
}
