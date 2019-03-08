import { Injectable } from '@angular/core';
import { UserQueryService } from './user-query.service';
import { UserReportService } from './user-report.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuOption } from '../shared/menu/menu.component';
import { UserReport } from './report';

function createOptions(
  userReport: UserReport,
  userReportService: UserReportService,
  userQueryService: UserQueryService,
  translateService: TranslateService,
  router: Router,
  onDeleteReport: (userReport: UserReport) => void,
  onSaveQuery: (userReport: UserReport) => void
): MenuOption[] {
  const SaveQueryOption = {
    label: translateService.instant('report-action.save-query'),
    click: () => onSaveQuery(userReport)
  };

  const DeleteOption = {
    label: translateService.instant('report-action.delete'),
    click: () => onDeleteReport(userReport)
  };

  const OpenOption = {
    click: () => userReportService.openReport(userReport.id),
    label: translateService.instant('report-action.download-report'),
    disabled: userReport.status !== 'COMPLETED'
  };

  switch (userReport.query.type) {
    case 'Student':
    case 'SchoolGrade':
    case 'Group':
      return [OpenOption, SaveQueryOption, DeleteOption];
    case 'DistrictSchoolExport':
      const ViewQueryOption = {
        label: translateService.instant('report-action.view-query'),
        click: () =>
          router.navigateByUrl(`/custom-export?userReportId=${userReport.id}`)
      };
      return [OpenOption, ViewQueryOption, SaveQueryOption, DeleteOption];
    case 'CustomAggregate':
    case 'Longitudinal':
    case 'Claim':
    case 'Target':
      const viewAndDownloadDisabled: boolean =
        userReport.status !== 'COMPLETED' &&
        !(userReport.status === 'PENDING' || userReport.status === 'RUNNING');

      const embargoed: boolean =
        userReport.metadata.createdWhileDataEmbargoed === 'true';

      const ViewAggregateOption = {
        label: translateService.instant('report-action.view-report'),
        disabled: viewAndDownloadDisabled,
        click: () => router.navigateByUrl(`/aggregate-reports/${userReport.id}`)
      };

      const ViewAggregateQueryOption = {
        label: translateService.instant('report-action.view-query'),
        click: () =>
          router.navigateByUrl(
            `/aggregate-reports?userReportId=${userReport.id}`
          )
      };

      const OpenAggregateOption = {
        label: translateService.instant('report-action.download-report'),
        tooltip: embargoed ? 'report-action.embargoed' : undefined,
        disabled: viewAndDownloadDisabled || embargoed,
        click: () => userReportService.openReport(userReport.id)
      };

      return [
        ViewAggregateOption,
        ViewAggregateQueryOption,
        SaveQueryOption,
        OpenAggregateOption,
        DeleteOption
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
    private userQueryService: UserQueryService
  ) {}

  createMenuOptions(
    userReport: UserReport,
    onDeleteReport: (userReport: UserReport) => void,
    onSaveQuery: (userReport: UserReport) => void
  ): MenuOption[] {
    return createOptions(
      userReport,
      this.userReportService,
      this.userQueryService,
      this.translateService,
      this.router,
      onDeleteReport,
      onSaveQuery
    );
  }
}
