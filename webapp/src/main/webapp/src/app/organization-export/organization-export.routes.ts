import { OrganizationExportComponent } from './organization-export.component';
import { Route } from '@angular/router';

export const organizationExportRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: OrganizationExportComponent
  }
];
