import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CodeEditorComponent } from './component/code-editor/code-editor.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PipelinesComponent } from './page/pipelines/pipelines.component';
import { PipelineCardComponent } from './component/pipeline-card/pipeline-card.component';
import { PipelineComponent } from './page/pipeline/pipeline.component';
import { PipelineFormComponent } from './component/pipeline-form/pipeline-form.component';
import { CommonModule } from '../../shared/common.module';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [
    CodeEditorComponent,
    PipelineCardComponent,
    PipelineComponent,
    PipelineFormComponent,
    PipelinesComponent
  ],
  exports: []
})
export class IngestPipelineModule {}
