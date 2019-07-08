import { NgModule } from '@angular/core';
import { GroupImportModule } from './groups/import/group-import.module';
import { GroupsModule } from './groups/groups.module';
import { FileFormatModule } from './groups/import/fileformat/file-format.module';
import { InstructionalResourceModule } from './instructional-resource/instructional-resource.module';
import { EmbargoModule } from './embargo/embargo.module';
import { ReportingCommonModule } from '../shared/reporting-common.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReportingCommonModule,
    GroupImportModule,
    GroupsModule,
    InstructionalResourceModule,
    EmbargoModule,
    FileFormatModule
  ],
  exports: [
    GroupImportModule,
    GroupsModule,
    InstructionalResourceModule,
    EmbargoModule,
    FileFormatModule
  ],
  providers: []
})
export class AdminModule {}
