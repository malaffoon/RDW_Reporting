import { Route } from '@angular/router';
import { ReportQueryResolve } from './report-query.resolve';
import { AggregateQueryFormContainerComponent } from './query-forms/aggregate-query-form-container.component';
import { AggregateReportResolve } from './results/aggregate-report.resolve';
import { AggregateReportComponent } from './results/aggregate-report.component';
import { AggregateReportOptionsResolve } from './aggregate-report-options.resolve';

export const aggregateReportRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    resolve: {
      options: AggregateReportOptionsResolve,
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
    resolve: {
      options: AggregateReportOptionsResolve,
      report: AggregateReportResolve
    },
    component: AggregateReportComponent
  }
];
