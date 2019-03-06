import { Injectable } from '@angular/core';
import { UserQueryService } from './user-query.service';
import { UserQueryStore } from './user-query.store';
import { UserReportService } from './user-report.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuOption } from '../shared/menu/menu.component';
import { first } from 'rxjs/operators';
import { UserReport } from './report';

function createOptions(
  userReport: UserReport,
  userReportService: UserReportService,
  userQueryService: UserQueryService,
  userQueryStore: UserQueryStore,
  translateService: TranslateService,
  router: Router
): MenuOption[] {
  const SaveOption = {
    click: () =>
      userQueryService
        .createQuery(userReport.query)
        .pipe(first())
        .subscribe(userQuery => {
          userQueryStore.setState([userQuery, ...userQueryStore.state]);
        }),
    label: translateService.instant('report-action.save-query')
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
          label: translateService.instant('report-action.download-report'),
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
          label: translateService.instant('report-action.view-report'),
          disabled: viewAndDownloadDisabled
        },
        {
          click: () =>
            router.navigateByUrl(`/aggregate-reports?src=${userReport.id}`),
          label: translateService.instant('report-action.view-query')
        },
        SaveOption,
        {
          click: () => userReportService.openReport(userReport.id),
          label: translateService.instant('report-action.download-report'),
          disabled: viewAndDownloadDisabled || embargoed,
          tooltip: embargoed ? 'report-action.embargoed' : undefined
        }
      ];
  }
  return [];
}

@Injectable()
export class UserReportMenuOptionService {
  constructor(
    private router: Router,
    private translateService: TranslateService,
    private userReportService: UserReportService,
    private userQueryService: UserQueryService,
    private userQueryStore: UserQueryStore
  ) {}

  createMenuOptions(userReport: UserReport): MenuOption[] {
    return createOptions(
      userReport,
      this.userReportService,
      this.userQueryService,
      this.userQueryStore,
      this.translateService,
      this.router
    );
  }
}
