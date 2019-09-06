import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/primeng';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { Angulartics2Module } from 'angulartics2';
import { GroupImportComponent } from './group-import.component';
import { GroupImportService } from './group-import.service';
import { FileUploadModule } from 'ng2-file-upload';
import { ImportHistoryComponent } from './history/import-history.component';
import { ImportHistoryResolve } from './history/import-history.resolve';
import { ImportTableComponent } from './import-table/import-table.component';
import { GroupImportDeactivateGuard } from './group-import.deactivate';
import { ReportingCommonModule } from '../../../shared/reporting-common.module';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    GroupImportComponent,
    ImportHistoryComponent,
    ImportTableComponent
  ],
  imports: [
    Angulartics2Module,
    CommonModule,
    ReportingCommonModule,
    FileUploadModule,
    FormsModule,
    PopoverModule,
    SharedModule,
    TableModule
  ],
  exports: [GroupImportComponent],
  providers: [
    GroupImportService,
    ImportHistoryResolve,
    GroupImportDeactivateGuard
  ]
})
export class GroupImportModule {}
