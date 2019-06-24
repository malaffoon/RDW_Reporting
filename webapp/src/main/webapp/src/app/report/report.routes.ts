import { AuthorizationCanActivate } from '../shared/security/authorization.can-activate';
import { ReportsComponent } from './reports.component';
import { Route } from '@angular/router';

export const reportRoutes: Route[] = [
  {
    path: 'reports',
    pathMatch: 'full',
    data: {
      breadcrumb: { translate: 'reports.heading' },
      permissions: ['GROUP_PII_READ']
    },
    canActivate: [AuthorizationCanActivate],
    component: ReportsComponent
  }
];
