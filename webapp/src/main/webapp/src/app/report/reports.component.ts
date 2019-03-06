import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Resolution } from '../shared/resolution.model';
import { UserReportService } from './user-report.service';
import { UserQuery, UserReport } from './report';
import { Observable } from 'rxjs';
import { UserQueryService } from './user-query.service';
import { first, tap } from 'rxjs/operators';
import { UserQueryStore } from './user-query.store';
import { MenuOption } from '../shared/menu/menu.component';
import { UserReportMenuOptionService } from './user-report-menu-option.service';
import { UserQueryMenuOptionService } from './user-query-menu-option.service';
import Timer = NodeJS.Timer;

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
  _optionsByUserReport: Map<UserReport, MenuOption[]> = new Map();
  _optionsByUserQuery: Map<UserReport, MenuOption[]> = new Map();

  constructor(
    private route: ActivatedRoute,
    private userReportService: UserReportService,
    private userReportMenuOptionService: UserReportMenuOptionService,
    private userQueryService: UserQueryService,
    private userQueryStore: UserQueryStore,
    private userQueryMenuOptionService: UserQueryMenuOptionService
  ) {}

  ngOnInit(): void {
    const { reports } = this.route.snapshot.data;
    this.resolution = reports;
    this.updateReports(reports.data);

    /*
     Start report status polling
     Since reports currently cannot be generated on this page we do not have to dynamically update the IDs to pull
     */
    if (this.resolution.isOk()) {
      this.startPollingStatus();
    }

    // initialize store
    this.userQueryService
      .getQueries()
      .pipe(first())
      .subscribe(userQueries => {
        this.userQueryStore.setState(userQueries);
      });
    this.userQueries = this.userQueryStore.getState().pipe(
      tap(userQueries => {
        this._optionsByUserQuery = new Map(
          userQueries.reduce((entries, userQuery) => {
            entries.push([
              userQuery,
              this.userQueryMenuOptionService.createMenuOptions(userQuery)
            ]);
            return entries;
          }, [])
        );
      })
    );
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
        this.userReportService.getReports(ids).subscribe(
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
              this.updateReports(updatedReports);
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

  private updateReports(values: UserReport[]): void {
    this.reports = values;
    this._optionsByUserReport = new Map(
      values.reduce((entries, userReport) => {
        entries.push([
          userReport,
          this.userReportMenuOptionService.createMenuOptions(userReport)
        ]);
        return entries;
      }, [])
    );
  }
}
