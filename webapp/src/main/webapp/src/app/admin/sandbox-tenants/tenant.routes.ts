import { Route } from '@angular/router';
import { TenantsComponent } from './pages/tenants/tenants.component';
import { NewTenantConfigurationComponent } from './pages/new-tenant.component';
import { HasAnyPermissionCanActivate } from '../../shared/security/can-activate/has-any-permission.can-activate';
import { TenantComponent } from './pages/tenant/tenant.component';
import { BreadcrumbContext } from '../../shared/layout/sb-breadcrumbs.component';

export const tenantBreadcrumb = ({
  route: {
    params: { id }
  }
}: BreadcrumbContext) => id;

export const tenantRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: TenantsComponent,
    data: {
      type: 'TENANT'
    }
  },
  {
    path: 'new',
    data: {
      breadcrumb: { translate: 'tenant-config.new-tenant.header' },
      permissions: ['TENANT_WRITE']
    },
    canActivate: [HasAnyPermissionCanActivate],
    component: NewTenantConfigurationComponent
  },
  {
    path: ':id',
    component: TenantComponent,
    data: {
      breadcrumb: tenantBreadcrumb
    }
  }
];
