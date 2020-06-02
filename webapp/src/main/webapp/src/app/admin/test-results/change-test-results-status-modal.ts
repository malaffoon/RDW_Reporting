import { Component, OnInit } from '@angular/core';
import { TestResultsService } from './service/test-results.service';
import { TestResultFilters } from './model/test-result-filters';
import { BsModalRef } from 'ngx-bootstrap';
import { filter } from 'rxjs/operators';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'change-test-results-status-modal',
  templateUrl: '/change-test-results-status-modal.html'
})
export class ChangeTestResultsStatusModal implements OnInit {
  testResultFilter: TestResultFilters;
  statusOptions: string[];

  private _subscription: Subscription;

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
    this.statusOptions = this.service.getTestResultsStatusOptions();
    this.testResultFilter = this.service.getTestResultFilterDefaults();
  }

  cancel(): void {
    this.modal.hide();
  }

  changeTestResults(): void {
    this.service.changeTestResults();
    // this.modal.hide();
  }
}
