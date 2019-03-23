import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserReportService } from './user-report.service';
import { UserQuery, UserReport } from './report';
import { forkJoin, Observable } from 'rxjs';
import { UserQueryService } from './user-query.service';
import { map } from 'rxjs/operators';
import { UserQueryStore } from './user-query.store';
import { MenuOption } from '../shared/menu/menu.component';
import { UserReportMenuOptionService } from './user-report-menu-option.service';
import { UserQueryMenuOptionService } from './user-query-menu-option.service';
import { UserReportStore } from './user-report.store';
import { BsModalService, TabsetComponent } from 'ngx-bootstrap';
import { Utils } from '../shared/support/support';
import { ReportFormService } from './service/report-form.service';
import Timer = NodeJS.Timer;
import { DeleteModalComponent } from './component/delete-modal/delete-modal.component';

interface MenuOptionHolder {
  options: MenuOption[];
}

interface UserReportView extends UserReport, MenuOptionHolder {}

interface UserQueryView extends UserReport, MenuOptionHolder {}

type LoadingStatus = 'Loading' | 'Loaded' | 'Failed';

/**
 * Responsible for controlling the behavior of the reports page
 */
@Component({
  selector: 'reports',
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit, OnDestroy {
  userReports: Observable<UserReportView[]>;
  userQueries: Observable<UserQueryView[]>;
  loadingStatus: LoadingStatus = 'Loading';

  @ViewChild('tabset')
  tabset: TabsetComponent;

  private statusPollingInterval: number = 20000;
  private statusPollingTimer: Timer;

  constructor(
    private route: ActivatedRoute,
    private userReportService: UserReportService,
    private userReportStore: UserReportStore,
    private userReportMenuOptionService: UserReportMenuOptionService,
    private userQueryService: UserQueryService,
    private userQueryStore: UserQueryStore,
    private userQueryMenuOptionService: UserQueryMenuOptionService,
    private reportFormService: ReportFormService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    forkJoin(
      this.userReportService.getReports(),
      this.userQueryService.getQueries()
    ).subscribe(
      ([userReports, userQueries]) => {
        // initialize stores
        this.userReportStore.setState(userReports);
        this.userReports = this.userReportStore.getState().pipe(
          map(userReports =>
            userReports.map(userReport => ({
              ...userReport,
              options: this.userReportMenuOptionService.createMenuOptions(
                userReport,
                userReport => this.onViewUserReportQuery(userReport),
                userReport => this.onDeleteUserReport(userReport),
                userReport => this.onSaveQuery(userReport)
              )
            }))
          )
        );

        this.userQueryStore.setState(userQueries);
        this.userQueries = this.userQueryStore.getState().pipe(
          map(userQueries =>
            userQueries.map(
              userQuery =>
                <UserQueryView>{
                  ...userQuery,
                  options: this.userQueryMenuOptionService.createMenuOptions(
                    userQuery,
                    userQuery => this.onViewUserQuery(userQuery),
                    userQuery => this.onCopyUserQuery(userQuery),
                    userQuery => this.onDeleteUserQuery(userQuery)
                  )
                }
            )
          )
        );

        // TODO use RxJS to setup polling more elegantly
        this.startPollingStatus();
        this.loadingStatus = 'Loaded';
      },
      () => {
        this.loadingStatus = 'Failed';
      }
    );
  }

  ngOnDestroy(): void {
    this.stopPollingStatus();
  }

  reload(): void {
    window.location.reload();
  }

  onViewUserQuery(userQuery: UserQuery): void {
    const modal = this.reportFormService.openReportForm({
      title: userQuery.query.name,
      query: userQuery.query,
      userQueryId: userQuery.id
    });
    modal.userQueryUpdated.subscribe(updated => {
      this.userQueryStore.setState(
        this.userQueryStore.state.map(existing =>
          existing.id === updated.id ? updated : existing
        )
      );
    });
  }

  onCopyUserQuery(userQuery: UserQuery): void {
    this.userQueryService
      .createQuery({
        ...userQuery.query,
        name: Utils.appendOrIncrementFileNameSuffix(userQuery.query.name)
      })
      .subscribe(userQuery => {
        this.userQueryStore.setState([userQuery, ...this.userQueryStore.state]);
      });
  }

  onDeleteUserQuery(userQuery: UserQuery): void {
    // const modalReference = this.modalService.show(DeleteModalComponent);
    // const modal: DeleteModalComponent = modalReference.content;
    // modal.messageId = 'user-query.action.delete.warning';
    // modal.name = userQuery.query.name;
    // modal.deleted.subscribe(() => {
    this.userQueryService.deleteQuery(userQuery.id).subscribe(() => {
      this.userQueryStore.setState(
        this.userQueryStore.state.filter(({ id }) => id !== userQuery.id)
      );
    });
    // });
  }

  onViewUserReportQuery(userReport: UserReport): void {
    const modal = this.reportFormService.openReportForm({
      title: userReport.query.name,
      query: userReport.query
    });
    modal.userReportCreated.subscribe(created => {
      this.userReportStore.setState([created, ...this.userReportStore.state]);
    });
    modal.userQueryCreated.subscribe(created => {
      this.userQueryStore.setState([created, ...this.userQueryStore.state]);
    });
  }

  onDeleteUserReport(userReport: UserReport): void {
    // const modalReference = this.modalService.show(DeleteModalComponent);
    // const modal: DeleteModalComponent = modalReference.content;
    // modal.messageId = 'report-action.delete-warning';
    // modal.name = userReport.query.name;
    // modal.deleted.subscribe(() => {
    this.userReportService.deleteReport(userReport.id).subscribe(() => {
      this.userReportStore.setState(
        this.userReportStore.state.filter(({ id }) => id !== userReport.id)
      );
    });
    // });
  }

  onSaveQuery(userReport: UserReport): void {
    this.userQueryService.createQuery(userReport.query).subscribe(userQuery => {
      this.userQueryStore.setState([userQuery, ...this.userQueryStore.state]);
      this.openQueryTab();
    });
  }

  private startPollingStatus(): void {
    this.statusPollingTimer = <Timer>setInterval(() => {
      const {
        userReportStore: { state: userReports }
      } = this;

      // get all report IDs for reports that are in progress
      const ids: number[] = userReports
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
            const updatedReports: UserReport[] = userReports.map(local => {
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
              this.userReportStore.setState(updatedReports);
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

  private openQueryTab(): void {
    this.tabset.tabs[1].active = true;
  }
}
