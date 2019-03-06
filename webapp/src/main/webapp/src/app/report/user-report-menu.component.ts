import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserReport } from './report';
import { UserReportService } from './user-report.service';
import { Router } from '@angular/router';
import { MenuOption } from '../shared/menu/menu.component';
import { UserQueryService } from './user-query.service';
import { first } from 'rxjs/operators';
import { UserQueryStore } from './user-query.store';

interface UserReportMenuContext {
  userReport: UserReport;
  userReportService: UserReportService;
  userQueryService: UserQueryService;
  userQueryStore: UserQueryStore;
  router: Router;
  translate: TranslateService;
}

function createMenuOptions({
  userReport,
  userReportService,
  userQueryService,
  userQueryStore,
  router,
  translate
}: UserReportMenuContext): MenuOption[] {
  const SaveOption = {
    click: () =>
      userQueryService
        .createQuery(userReport.query)
        .pipe(first())
        .subscribe(userQuery => {
          userQueryStore.setState([userQuery, ...userQueryStore.state]);
        }),
    label: translate.instant('report-action.save-query')
  };

  switch (userReport.query.type) {
    case 'Student':
    case 'SchoolGrade':
    case 'Group':
    case 'DistrictSchoolExport':
      return [
        SaveOption,
        {
          click: () => userReportService.openReport(userReport.id),
          label: translate.instant('report-action.download-report'),
          disabled: userReport.status !== 'COMPLETED'
        }
      ];
    case 'CustomAggregate':
    case 'Longitudinal':
    case 'Claim':
    case 'Target':
      const viewAndDownloadDisabled: boolean =
        userReport.status !== 'COMPLETED' &&
        !(userReport.status === 'PENDING' || userReport.status === 'RUNNING');
      const embargoed: boolean =
        userReport.metadata.createdWhileDataEmbargoed === 'true';
      return [
        {
          click: () =>
            router.navigateByUrl(`/aggregate-reports/${userReport.id}`),
          label: translate.instant('report-action.view-report'),
          disabled: viewAndDownloadDisabled
        },
        {
          click: () =>
            router.navigateByUrl(`/aggregate-reports?src=${userReport.id}`),
          label: translate.instant('report-action.view-query')
        },
        SaveOption,
        {
          click: () => userReportService.openReport(userReport.id),
          label: translate.instant('report-action.download-report'),
          disabled: viewAndDownloadDisabled || embargoed,
          tooltip: embargoed ? 'report-action.embargoed' : undefined
        }
      ];
  }
  return [];
}

@Component({
  selector: 'user-report-menu',
  templateUrl: './user-report-menu.component.html'
})
export class UserReportMenuComponent {
  _report: UserReport;
  _options: MenuOption[];

  constructor(
    private router: Router,
    private translate: TranslateService,
    private userReportService: UserReportService,
    private userQueryService: UserQueryService,
    private userQueryStore: UserQueryStore
  ) {}

  @Input()
  set report(value: UserReport) {
    this._report = value;
    this._options = createMenuOptions({
      userReport: value,
      userReportService: this.userReportService,
      userQueryService: this.userQueryService,
      userQueryStore: this.userQueryStore,
      router: this.router,
      translate: this.translate
    });
  }
}
