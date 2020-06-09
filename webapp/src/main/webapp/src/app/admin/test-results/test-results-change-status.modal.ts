import { BsModalRef } from 'ngx-bootstrap';
import { TestResultsService } from './service/test-results.service';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { TestResultFilters } from './model/test-result-filters';

@Component({
  selector: 'test-results-change-status-modal',
  templateUrl: 'test-results-change-status.modal.html'
})
export class TestResultsChangeStatusModal implements OnInit {
  private _subscription: Subscription;
  selectedFilters: TestResultFilters;
  statusOptions: string[];
  selectedStatus: string;
  unableToChange: boolean;
  successfulChange: boolean = false;

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
  }

  private cancel() {
    this.modal.hide();
  }

  changeTestResults(): void {
    this.service.changeTestResults(this.selectedFilters, this.selectedStatus);
    if (!this.service.successfulChange) {
      this.unableToChange = true;
    } else {
      this.successfulChange = true;
      // setTimeout(() => {
      //   document.getElementById('success-alert').scrollIntoView();
      // }, 500);
      // this.modal.hide();
    }
  }

  onChangeStatusFilter(status: any): void {
    this.selectedStatus = status;
  }
}
