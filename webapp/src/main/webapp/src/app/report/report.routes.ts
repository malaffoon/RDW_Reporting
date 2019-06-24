import { ReportsComponent } from './reports.component';
import { Route } from '@angular/router';
import { HasAnyPermissionCanActivate } from '../shared/security/can-activate/has-any-permission.can-activate';

export const reportRoutes: Route[] = [
  {
    path: 'reports',
    pathMatch: 'full',
    data: {
      breadcrumb: { translate: 'reports.heading' },
      permissions: ['GROUP_PII_READ']
    },
    canActivate: [HasAnyPermissionCanActivate],
    component: ReportsComponent
  }
];
