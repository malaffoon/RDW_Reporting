import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  BsDropdownModule,
  ButtonsModule,
  ModalModule,
  PopoverModule
} from 'ngx-bootstrap';
import { ReportingCommonModule } from '../../shared/reporting-common.module';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { AccordionModule, TreeTableModule } from 'primeng/primeng';
import { PropertyOverrideTableComponent } from './component/property-override-table/property-override-table.component';
import { PropertyOverrideTreeTableComponent } from './component/property-override-tree-table/property-override-tree-table.component';
import { WellGroupListComponent } from './component/well-group-list/well-group-list.component';
import { TenantSandboxComponent } from './component/tenant-sandbox/tenant-sandbox.component';
import { CommonModule } from '@angular/common';
import { TenantLinkComponent } from './component/tenant-link/tenant-link.component';
import { NewSandboxConfigurationComponent } from './pages/new-sandbox.component';
import { NewTenantConfigurationComponent } from './pages/new-tenant.component';
import { TenantsComponent } from './pages/tenants/tenants.component';
import { TenantComponent } from './pages/tenant/tenant.component';
import { PropertyOverrideTableControlsComponent } from './component/property-override-table-controls/property-override-table-controls.component';
import { ToggleLabelComponent } from './component/toggle-label/toggle-label.component';

/**
 * TODO join this with tenant.module and make the route structure this:
 *
 * tenants?sandbox=true|false to choose what tenants to display at any given time
 */
@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    ReportingCommonModule,
    AccordionModule,
    ButtonsModule,
    MenuModule,
    ModalModule,
    PopoverModule,
    TableModule,
    TreeTableModule
  ],
  declarations: [
    PropertyOverrideTableComponent,
    PropertyOverrideTreeTableComponent,
    WellGroupListComponent,
    TenantSandboxComponent,
    TenantLinkComponent,
    NewSandboxConfigurationComponent,
    NewTenantConfigurationComponent,
    TenantsComponent,
    TenantComponent,
    PropertyOverrideTableControlsComponent,
    ToggleLabelComponent
  ],
  exports: [
    PropertyOverrideTableComponent,
    PropertyOverrideTreeTableComponent,
    WellGroupListComponent,
    TenantSandboxComponent,
    TenantLinkComponent,
    NewSandboxConfigurationComponent,
    NewTenantConfigurationComponent,
    TenantsComponent,
    TenantComponent,
    PropertyOverrideTableControlsComponent,
    ToggleLabelComponent
  ]
})
export class SandboxTenantSharedModule {}
