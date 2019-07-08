import { OrganizationExportComponent } from './organization-export.component';
import { Route } from '@angular/router';
import { HasAnyPermissionCanActivate } from '../shared/security/can-activate/has-any-permission.can-activate';

export const organizationExportRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    data: {
      breadcrumb: { translate: 'organization-export.title' },
      permissions: ['INDIVIDUAL_PII_READ']
    },
    canActivate: [HasAnyPermissionCanActivate],
    component: OrganizationExportComponent
  }
];
