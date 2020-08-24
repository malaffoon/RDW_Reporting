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
import { UserService } from '../../shared/security/service/user.service';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UserOptions } from './model/user-options';

class Column {
  id: string; // en.json name
  field: string; // field name used for sorting and styles
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

  // Paging data
  totalRowCount = 1000;
  currentOffset = 0;
  rowsPerPage = 20; // TODO: set to be configurable
  loading = false;
  sortField = 'default';
  sortOrder = 1;
  testResultAvailabilityFilters: TestResultAvailabilityFilters;

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
  filteredTestResults$: Observable<TestResultAvailability[]>;
  displayData$: Observable<any[]>;
  filteredResultsEmpty$: Observable<boolean>;
  userOptions$: Observable<UserOptions>;

  viewAudit$: Observable<boolean>; // only DevOps has ability
  state: string; // state of tenant or sandbox logged into

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

        this.statusTransitionOptions$.subscribe(options => {
          modal.statusOptions = options;
          // For fully-privileged users (all three status options), default to Reviewing. For others, default
          // to Released. Handle degenerative cases, although these should not occur.
          if (modal.statusOptions.length === 0) {
            console.warn('invalid state: no status options');
            modal.selectedStatus = null;
          } else {
            modal.selectedStatus =
              modal.statusOptions[modal.statusOptions.length === 1 ? 0 : 1];
          }
        });

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

    // Data for Drop downs
    // set defaults - needed since this component is initialized first
    this.testResultsService.setTestResultFilterDefaults();
    this.testResultAvailabilityFilters = this.testResultsService.getTestResultAvailabilityFilterDefaults();

    this.userOptions$ = this.testResultsService.getUserOptions();
    this.isDistrictAdmin$ = this.userOptions$.pipe(
      map(options => options.districtAdmin)
    );
    this.viewAudit$ = this.userOptions$.pipe(map(options => options.viewAudit));

    // this.updateFilteredTestResults();
    this.updateFilters();
  }

  updateTestResultsData() {
    this.filteredTestResults$ = this.testResultsService.getTestResults(
      this.testResultAvailabilityFilters,
      {
        rowOffset: this.currentOffset,
        pageSize: this.rowsPerPage,
        sortField: this.resolveSortField(this.sortField, this.sortOrder),
        descending: this.sortOrder && this.sortOrder < 0
      }
    );

    this.filteredResultsEmpty$ = this.filteredTestResults$.pipe(
      map(results => results.length === 0)
    );

    this.displayData$ = this.filteredTestResults$.pipe(
      map(results => {
        return results.map(result => this.toDisplayValues(result));
      })
    );
  }

  private resolveSortField(sortField: string, sortOrder: number): string {
    if (!sortOrder || !sortField || sortField === 'default') {
      return null;
    }

    // Resolve ambiguities with district and subject sorting.
    if (sortField === 'district') {
      return 'district-name';
    }

    if (sortField === 'subject') {
      return 'subject-code';
    }

    return sortField;
  }

  private toDisplayValues(result: TestResultAvailability) {
    return {
      schoolYear: result.schoolYear.label,
      district: result.district.label,
      subject: this.translate.instant(this.toSubjectKey(result.subject.label)),
      status: this.translate.instant(this.toStatusKey(result.status.label)),
      reportType: this.translate.instant(
        this.toReportTypeKey(result.reportType.label)
      ),
      examCount: result.examCount,
      statusValue: result.status.value
    };
  }

  private getOptionsByField(field: string, toTranslateKey = label => label) {
    // TODO: populate from options query. Results data is now paged and won't contain all the filters.
    return of([TestResultsAvailabilityService.FilterIncludeAll]);
    // const sort = 'label';
    // return this.filteredTestResults$.pipe(
    //   map((results: TestResultAvailability[]) => {
    //     const ids = results.map(r => r[field].value);
    //     const options = results
    //       .map(r => {
    //         return {
    //           label: toTranslateKey(r[field].label),
    //           value: r[field].value
    //         };
    //       })
    //       .filter((item, idx) => ids.indexOf(item.value) === idx)
    //       .sort((a, b) => a[sort].localeCompare(b[sort]));
    //
    //     options.unshift(TestResultsAvailabilityService.FilterIncludeAll);
    //
    //     return options;
    //   })
    // );
  }

  private updateFilters() {
    this.schoolYearOptions$ = this.getOptionsByField('schoolYear');
    this.subjectOptions$ = this.getOptionsByField('subject', this.toSubjectKey);
    this.reportTypeOptions$ = this.getOptionsByField(
      'reportType',
      this.toReportTypeKey
    );

    // Districts done differently. District admins will have lists of districts they can use.
    this.districtOptions$ = this.userOptions$.pipe(
      map((user: UserOptions) => {
        // TODO: Sort by name or ID? Assuming name for now.
        const districtOptions = user.districts.sort((a, b) =>
          a.label.localeCompare(b.label)
        );

        // For single district, set the filters to match. Otherwise, add the "Include All" option.
        if (districtOptions.length === 1) {
          this.testResultAvailabilityFilters.district = districtOptions[0];
        } else {
          districtOptions.unshift(
            TestResultsAvailabilityService.FilterIncludeAll
          );
        }
        return districtOptions;
      })
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

  /**
   * Event handler for a change to the results table that requires a data refresh.
   * The handled events are navigation to a new page and change to sort.
   *
   * @param $event the table event object with page offset and sort information.
   */
  resultsTablePageChange($event) {
    // console.log($event);
    this.sortField = $event.sortField;
    this.sortOrder = $event.sortOrder;
    this.currentOffset = $event.first;

    this.updateTestResultsData();
  }

  onChangeSchoolYearFilter(schoolYear: any) {
    this.testResultAvailabilityFilters.schoolYear = schoolYear;
    this.updateTestResultsData();
  }

  onChangeDistrictFilter(district: any) {
    this.testResultAvailabilityFilters.district = district;
    this.updateTestResultsData();
  }

  onChangeSubjectFilter(subject: any) {
    this.testResultAvailabilityFilters.subject = subject;
    this.updateTestResultsData();
  }

  onChangeReportTypeFilter(reportType: any) {
    this.testResultAvailabilityFilters.reportType = reportType;
    this.updateTestResultsData();
  }

  onChangeStatusFilter(status: any) {
    this.testResultAvailabilityFilters.status = status;
    this.updateTestResultsData();
  }

  testResultsRowStyleClass(rowData: any) {
    return rowData.statusValue === 'Loading'
      ? 'loadingColor'
      : rowData.statusValue === 'Reviewing'
      ? 'reviewingColor'
      : 'releasedColor';
  }

  downloadAuditFile(): void {
    this.testResultsService.openReport();
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
