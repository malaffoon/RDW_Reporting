import { Route } from '@angular/router';
import { TenantsComponent } from './pages/tenants/tenants.component';
import { NewTenantConfigurationComponent } from './pages/new-tenant.component';

export const tenantRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    component: TenantsComponent
  },
  {
    path: 'new',
    pathMatch: 'prefix',
    data: {
      breadcrumb: { translate: 'tenant-config.new-tenant.header' },
      permissions: ['TENANT_WRITE']
    },
    children: [
      {
        path: '',
        pathMatch: 'prefix',
        component: NewTenantConfigurationComponent
      }
    ]
  }
];
