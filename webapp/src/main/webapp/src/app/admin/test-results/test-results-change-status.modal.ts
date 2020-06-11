import { BsModalRef } from 'ngx-bootstrap';
import { TestResultsService } from './service/test-results.service';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { TestResultFilters } from './model/test-result-filters';

@Component({
  selector: 'test-results-change-status-modal',
  templateUrl: 'test-results-change-status.modal.html'
})
export class TestResultsChangeStatusModal implements OnInit {
  private _subscription: Subscription;
  public changeStatusEvent: EventEmitter<any> = new EventEmitter();
  selectedFilters: TestResultFilters;
  statusOptions: string[];
  selectedStatus: string;

  // below determine which if any alert need to be displayed
  unableToChange: boolean;
  successfulChange: boolean;
  showSandboxAlert: boolean; // if sandbox and user tries to change status

  constructor(
    private modal: BsModalRef,
    private service: TestResultsService,
    private router: Router
  ) {
    this._subscription = router.events
      .pipe(filter(e => e instanceof NavigationStart))
      .subscribe(() => {
        this.cancel();
      });
  }

  ngOnInit(): void {
    this.selectedFilters = this.service.getTestResultFilterDefaults();
    this.statusOptions = this.service.getTestResultsStatusOptions();
    this.selectedStatus =
      this.service.isDistrictAdmin() == true ? 'Released' : 'Reviewing';
    this.showSandboxAlert = false;
    this.successfulChange = false;
  }

  private cancel() {
    this.modal.hide();
  }

  changeTestResults(): void {
    if (this.service.isSandbox()) {
      // is a sandbox, do not allow and actual test results status changes
      // keep modal up to display message to user
      this.showSandboxAlert = true;
    } else {
      this.service.changeTestResults(this.selectedFilters, this.selectedStatus);

      if (!this.service.successfulChange) {
        this.unableToChange = true;
      } else {
        this.successfulChange = true;
      }
      this.triggerEventStatus(this.successfulChange, this.unableToChange);
      this.modal.hide();
    }
  }

  private triggerEventStatus(
    successfulChange: boolean,
    unableToChange: boolean
  ) {
    this.changeStatusEvent.emit({
      data: successfulChange,
      res: 200,
      error: unableToChange
    });
  }

  onChangeStatusFilter(status: any): void {
    this.selectedStatus = status;
  }
}
