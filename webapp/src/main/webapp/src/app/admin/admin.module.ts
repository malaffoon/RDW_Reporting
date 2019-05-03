import { NgModule } from '@angular/core';
import { GroupImportModule } from './groups/import/group-import.module';
import { GroupsModule } from './groups/groups.module';
import { FileFormatModule } from './groups/import/fileformat/file-format.module';
import { InstructionalResourceModule } from './instructional-resource/instructional-resource.module';
import { EmbargoModule } from './embargo/embargo.module';
import { SandboxModule } from './sandbox-tenants/sandbox.module';
import { CommonModule } from '../shared/common.module';
import { BrowserModule } from '@angular/platform-browser';
import { IngestPipelineModule } from './ingest-pipeline/ingest-pipeline.module';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    CommonModule,
    GroupImportModule,
    GroupsModule,
    IngestPipelineModule,
    InstructionalResourceModule,
    EmbargoModule,
    FileFormatModule,
    SandboxModule
  ],
  exports: [
    GroupImportModule,
    GroupsModule,
    IngestPipelineModule,
    InstructionalResourceModule,
    EmbargoModule,
    FileFormatModule
  ],
  providers: []
})
export class AdminModule {}
