import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/components/common/shared';
import { Angulartics2Module } from 'angulartics2';
import { CommonModule } from '../shared/common.module';
import { OrganizationExportComponent } from './organization-export.component';
import { UserOrganizationService } from './organization/user-organization.service';
import { OrganizationTreeComponent } from './organization/organization-tree.component';

@NgModule({
  declarations: [OrganizationExportComponent, OrganizationTreeComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    Angulartics2Module
  ]
})
export class OrganizationExportModule {}
