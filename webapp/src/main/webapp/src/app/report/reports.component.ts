import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Resolution } from '../shared/resolution.model';
import Timer = NodeJS.Timer;
import { UserReportService } from './user-report.service';
import { UserQuery, UserReport } from './report';
import { Observable, of } from 'rxjs';
import { UserQueryService } from './user-query.service';

/**
 * Responsible for controlling the behavior of the reports page
 */
@Component({
  selector: 'reports',
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit, OnDestroy {
  resolution: Resolution<UserReport[]>;
  reports: UserReport[];
  userQueries: Observable<UserQuery[]>;

  private statusPollingInterval: number = 20000;
  private statusPollingTimer: Timer;

  constructor(
    private route: ActivatedRoute,
    private service: UserReportService,
    private userQueryService: UserQueryService
  ) {}

  ngOnInit(): void {
    const { reports } = this.route.snapshot.data;
    this.resolution = reports;
    this.reports = reports.data;
    this.userQueries = this.userQueryService.getQueries();

    /*
     Start report status polling
     Since reports currently cannot be generated on this page we do not have to dynamically update the IDs to pull
     */
    if (this.resolution.isOk()) {
      this.startPollingStatus();
    }
  }

  ngOnDestroy(): void {
    this.stopPollingStatus();
  }

  reload(): void {
    window.location.reload();
  }

  private startPollingStatus(): void {
    this.statusPollingTimer = <Timer>setInterval(() => {
      // get all report IDs for reports that are in progress
      const ids: number[] = this.reports
        .filter(
          report => report.status === 'RUNNING' || report.status === 'PENDING'
        )
        .map(report => report.id);

      // optimally only call API if there are reports that are in progress
      if (ids.length > 0) {
        // optimally only send IDs of reports that are in progress
        this.service.getReports(ids).subscribe(
          remoteReports => {
            // flag set when one or more reports are found to have a new status
            let updated: boolean = false;

            // creates a copy of the existing report collection and updates it with reports that have changed
            const updatedReports: UserReport[] = this.reports.map(local => {
              const remote: UserReport = remoteReports.find(
                remote => remote.id === local.id
              );
              if (remote !== undefined && remote.status !== local.status) {
                updated = true;
                return remote;
              }
              return local;
            });

            // optimally updates the local report collection only when a change is detected
            if (updated) {
              this.reports = updatedReports;
            }
          },
          error => {
            console.error('Error polling report status', error);
          }
        );
      } else {
        this.stopPollingStatus();
      }
    }, this.statusPollingInterval);
  }

  private stopPollingStatus(): void {
    if (this.statusPollingTimer != null) {
      clearInterval(this.statusPollingTimer);
    }
  }
}
