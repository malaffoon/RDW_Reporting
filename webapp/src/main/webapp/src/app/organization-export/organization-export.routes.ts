import { AuthorizationCanActivate } from '../shared/security/authorization.can-activate';
import { OrganizationExportComponent } from './organization-export.component';
import { Route } from '@angular/router';

export const organizationExportRoutes: Route[] = [
  {
    path: 'custom-export',
    pathMatch: 'full',
    data: {
      breadcrumb: { translate: 'organization-export.title' },
      permissions: ['INDIVIDUAL_PII_READ']
    },
    canActivate: [AuthorizationCanActivate],
    component: OrganizationExportComponent
  }
];
