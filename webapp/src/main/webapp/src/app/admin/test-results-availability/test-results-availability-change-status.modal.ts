import { BsModalRef } from 'ngx-bootstrap';
import { TestResultsAvailabilityService } from './service/test-results-availability.service';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { TestResultAvailabilityFilters } from './model/test-result-availability-filters';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'test-results-change-status-modal',
  templateUrl: 'test-results-availability-change-status.modal.html'
})
// tslint:disable-next-line:component-class-suffix
export class TestResultsAvailabilityChangeStatusModal implements OnInit {
  private _subscription: Subscription;
  public changeStatusEvent: EventEmitter<any> = new EventEmitter();
  selectedFilters: TestResultAvailabilityFilters;
  statusOptions: { label: string; value: string }[];
  selectedStatus: { label: string; value: string };

  // below determine which if any alert need to be displayed
  unableToChange: boolean;
  successfulChange: boolean;
  showSandboxAlert: boolean; // if sandbox and user tries to change status
  sandboxUser: boolean;
  private successChangeMessage: string;

  constructor(
    private modal: BsModalRef,
    private service: TestResultsAvailabilityService,
    private router: Router,
    private translate: TranslateService
  ) {
    this._subscription = router.events
      .pipe(filter(e => e instanceof NavigationStart))
      .subscribe(() => {
        this.cancel();
      });
  }

  ngOnInit(): void {
    this.selectedFilters = this.service.getTestResultAvailabilityFilterDefaults();
    this.showSandboxAlert = false;
    this.successfulChange = false;
  }

  cancel() {
    this.modal.hide();
  }

  changeTestResults(): void {
    if (this.sandboxUser) {
      // is a sandbox, do not allow and actual test results status changes
      // keep modal up to display message to user
      this.showSandboxAlert = true;
    } else {
      this.service.changeTestResults(this.selectedFilters, this.selectedStatus);

      if (!this.service.successfulChange) {
        this.unableToChange = true;
        this.successfulChange = false;
      } else {
        this.unableToChange = false;
        this.successfulChange = true;
        this.successChangeMessage = this.getSuccessfulChangeMessage();
      }
      this.triggerEventStatus(this.unableToChange, this.successChangeMessage);
      this.modal.hide();
    }
  }

  // build up message that expects to go between msgs test-results-availability-change-status.successful-change-1
  // and test-results-availability-change-status.successful-change-3
  getSuccessfulChangeMessage(): string {
    return (
      '"' +
      `${this.translate.instant(this.selectedStatus.label)}` +
      '"' +
      `${this.translate.instant(
        'test-results-availability-change-status.successful-change-2'
      )}` +
      `${this.translate.instant(
        'test-results-availability.filter-school-year'
      )}: ` +
      `${this.translate.instant(this.selectedFilters.schoolYear.label)}` +
      ', ' +
      `${this.translate.instant(
        'test-results-availability.filter-subject'
      )}: ` +
      `${this.translate.instant(this.selectedFilters.subject.label)}` +
      ', ' +
      `${this.translate.instant(
        'test-results-availability.filter-district'
      )}: ` +
      `${this.translate.instant(this.selectedFilters.district.label)}` +
      ', ' +
      `${this.translate.instant(
        'test-results-availability.filter-report-type'
      )}: ` +
      `${this.translate.instant(this.selectedFilters.reportType.label)}` +
      ').'
    );
  }

  private triggerEventStatus(
    unableToChange: boolean,
    successChangeMsgOptions: string
  ) {
    this.changeStatusEvent.emit({
      // return the selected filters and status of the successful change
      data: successChangeMsgOptions,
      res: 200,
      error: unableToChange
    });
  }

  onChangeStatusFilter(status: any): void {
    this.selectedStatus = status;
  }
}
