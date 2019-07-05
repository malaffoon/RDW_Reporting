import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/components/common/shared';
import { Angulartics2Module } from 'angulartics2';
import { ReportingCommonModule } from '../shared/reporting-common.module';
import { OrganizationExportComponent } from './organization-export.component';
import { OrganizationTreeComponent } from './organization/organization-tree.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [OrganizationExportComponent, OrganizationTreeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReportingCommonModule,
    SharedModule,
    Angulartics2Module
  ]
})
export class OrganizationExportModule {}
