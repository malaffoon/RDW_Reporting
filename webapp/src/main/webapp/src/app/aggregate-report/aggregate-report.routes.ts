import { Route } from '@angular/router';
import { AggregateReportOptionsResolve } from './aggregate-report-options.resolve';
import { AuthorizationCanActivate } from '../shared/security/authorization.can-activate';
import { ReportQueryResolve } from './report-query.resolve';
import { AggregateQueryFormContainerComponent } from './query-forms/aggregate-query-form-container.component';
import { AggregateReportResolve } from './results/aggregate-report.resolve';
import { AggregateReportComponent } from './results/aggregate-report.component';

export const aggregateReportRoutes: Route[] = [
  {
    path: 'aggregate-reports',
    data: {
      breadcrumb: { translate: 'aggregate-reports.heading' },
      permissions: ['CUSTOM_AGGREGATE_READ']
    },
    resolve: {
      options: AggregateReportOptionsResolve
    },
    canActivate: [AuthorizationCanActivate],
    children: [
      {
        path: '',
        pathMatch: 'full',
        resolve: {
          query: ReportQueryResolve
        },
        component: AggregateQueryFormContainerComponent
      },
      {
        path: ':id',
        pathMatch: 'full',
        data: {
          breadcrumb: { resolve: 'report.label' }
        },
        resolve: { report: AggregateReportResolve },
        component: AggregateReportComponent
      }
    ]
  }
];
