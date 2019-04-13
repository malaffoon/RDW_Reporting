import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CodeEditorComponent } from './component/code-editor/code-editor.component';
import { IngestPipelineComponent } from './page/ingest-pipeline/ingest-pipeline.component';

@NgModule({
  imports: [BrowserModule],
  declarations: [CodeEditorComponent, IngestPipelineComponent],
  exports: [IngestPipelineComponent]
})
export class IngestPipelineModule {}
