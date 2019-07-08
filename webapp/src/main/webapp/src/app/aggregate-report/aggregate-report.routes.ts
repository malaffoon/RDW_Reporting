import { Route } from '@angular/router';
import { AggregateReportOptionsResolve } from './aggregate-report-options.resolve';
import { ReportQueryResolve } from './report-query.resolve';
import { AggregateQueryFormContainerComponent } from './query-forms/aggregate-query-form-container.component';
import { AggregateReportResolve } from './results/aggregate-report.resolve';
import { AggregateReportComponent } from './results/aggregate-report.component';
import { HasAnyPermissionCanActivate } from '../shared/security/can-activate/has-any-permission.can-activate';

export const aggregateReportRoutes: Route[] = [
  {
    path: '',
    data: {
      breadcrumb: { translate: 'aggregate-reports.heading' },
      permissions: ['CUSTOM_AGGREGATE_READ']
    },
    resolve: {
      options: AggregateReportOptionsResolve
    },
    canActivate: [HasAnyPermissionCanActivate],
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
