import { Route } from '@angular/router';
import { TenantsComponent } from './pages/tenants/tenants.component';
import { HasAnyPermissionCanActivate } from '../../shared/security/can-activate/has-any-permission.can-activate';
import { TenantComponent } from './pages/tenant/tenant.component';
import { BreadcrumbContext } from '../../shared/layout/sb-breadcrumbs.component';

export const tenantBreadcrumb = ({
  route: {
    params: { id }
  }
}: BreadcrumbContext) => id;

export const newTenantBreadcrumb = ({
  route: {
    data: { type }
  },
  translateService
}: BreadcrumbContext) => translateService.instant(`tenants.create.${type}`);

export const tenantRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: TenantsComponent
  },
  {
    path: 'new',
    data: {
      breadcrumb: newTenantBreadcrumb,
      permissions: ['TENANT_WRITE'],
      mode: 'create'
    },
    canActivate: [HasAnyPermissionCanActivate],
    component: TenantComponent
  },
  {
    path: ':id',
    component: TenantComponent,
    data: {
      breadcrumb: tenantBreadcrumb,
      mode: 'update'
    }
  }
];