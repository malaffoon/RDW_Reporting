import { NgModule } from '@angular/core';
import { GroupImportModule } from './groups/import/group-import.module';
import { GroupsModule } from './groups/groups.module';
import { FileFormatModule } from './groups/import/fileformat/file-format.module';
import { InstructionalResourceModule } from './instructional-resource/instructional-resource.module';
import { EmbargoModule } from './embargo/embargo.module';
import { TenantModule } from './sandbox-tenants/tenant.module';
import { CommonModule } from '../shared/common.module';
import { BrowserModule } from '@angular/platform-browser';
// import { IngestPipelineModule } from './ingest-pipeline/ingest-pipeline.module';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    CommonModule,
    GroupImportModule,
    GroupsModule,
    // IngestPipelineModule,
    InstructionalResourceModule,
    EmbargoModule,
    FileFormatModule,
    TenantModule
  ],
  exports: [
    GroupImportModule,
    GroupsModule,
    // IngestPipelineModule,
    InstructionalResourceModule,
    EmbargoModule,
    FileFormatModule
  ],
  providers: []
})
export class AdminModule {}
