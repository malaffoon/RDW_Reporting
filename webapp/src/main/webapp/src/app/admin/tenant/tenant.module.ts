import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { tenantRoutes } from './tenant.routes';
import { TranslateModule } from '@ngx-translate/core';
import { translateModuleConfiguration } from '../../shared/translate-module-configuration';
import { CommonModule } from '@angular/common';
import {
  BsDropdownModule,
  ButtonsModule,
  ModalModule,
  PopoverModule
} from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportingCommonModule } from '../../shared/reporting-common.module';
import {
  AutoCompleteModule,
  MenuModule,
  MultiSelectModule,
  TreeTableModule
} from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { PropertyOverrideTableComponent } from './component/property-override-table/property-override-table.component';
import { PropertyOverrideTreeTableComponent } from './component/property-override-tree-table/property-override-tree-table.component';
import { WellGroupListComponent } from './component/well-group-list/well-group-list.component';
import { TenantFormComponent } from './component/tenant-form/tenant-form.component';
import { TenantLinkComponent } from './component/tenant-link/tenant-link.component';
import { TenantsComponent } from './pages/tenants/tenants.component';
import { TenantComponent } from './pages/tenant/tenant.component';
import { ToggleLabelComponent } from './component/toggle-label/toggle-label.component';
import { TenantMetricsTable } from './component/tenant-metrics/tenant-metrics-table.component';
import { TenantMetricsComponent } from './pages/tenant-metrics/tenant-metrics.component';

@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    ReportingCommonModule,
    ButtonsModule,
    MenuModule,
    ModalModule.forRoot(), // this is needed in lazy modules for some reason
    PopoverModule,
    TableModule,
    TreeTableModule,
    MultiSelectModule,
    AutoCompleteModule,
    TranslateModule.forChild(translateModuleConfiguration),
    RouterModule.forChild(tenantRoutes)
  ],
  declarations: [
    PropertyOverrideTableComponent,
    PropertyOverrideTreeTableComponent,
    WellGroupListComponent,
    TenantFormComponent,
    TenantLinkComponent,
    TenantsComponent,
    TenantComponent,
    ToggleLabelComponent,
    TenantMetricsTable,
    TenantMetricsComponent
  ]
})
export class TenantModule {}
