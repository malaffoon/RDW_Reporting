import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CodeEditorComponent } from './component/code-editor/code-editor.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipelinesComponent } from './page/pipelines/pipelines.component';
import { PipelineCardComponent } from './component/pipeline-card/pipeline-card.component';
import { PipelineComponent } from './page/pipeline/pipeline.component';
import { PipelineFormComponent } from './component/pipeline-form/pipeline-form.component';
import { CommonModule } from '../../shared/common.module';
import { PipelineTestsComponent } from './page/pipeline-tests/pipeline-tests.component';
import { PipelineTestFormComponent } from './component/pipeline-test-form/pipeline-test-form.component';
import { PipelineTestListComponent } from './component/pipeline-test-list/pipeline-test-list.component';
import { PipelineEditorComponent } from './component/pipeline-editor/pipeline-editor.component';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [
    CodeEditorComponent,
    PipelineCardComponent,
    PipelineComponent,
    PipelineFormComponent,
    PipelinesComponent,
    PipelineTestsComponent,
    PipelineTestFormComponent,
    PipelineTestListComponent,
    PipelineEditorComponent
  ],
  exports: []
})
export class IngestPipelineModule {}
