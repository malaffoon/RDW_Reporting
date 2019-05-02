import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CodeEditorComponent } from './component/code-editor/code-editor.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipelinesComponent } from './page/pipelines/pipelines.component';
import { PipelineCardComponent } from './component/pipeline-card/pipeline-card.component';
import { PipelineComponent } from './page/pipeline/pipeline.component';
import { CommonModule } from '../../shared/common.module';
import { PipelineEditorComponent } from './component/pipeline-editor/pipeline-editor.component';
import { BsDropdownModule, ButtonsModule, TooltipModule } from 'ngx-bootstrap';
import { PipelineExplorerComponent } from './component/pipeline-explorer/pipeline-explorer.component';
import { PipelineTestResultsComponent } from './component/pipeline-test-results/pipeline-test-results.component';
import { PipelineItemComponent } from './component/pipeline-item/pipeline-item.component';
import { CodeDifferenceComponent } from './component/code-difference/code-difference.component';
import { PipelineTestFormComponent } from './component/pipeline-test-form/pipeline-test-form.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonsModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot()
  ],
  declarations: [
    CodeDifferenceComponent,
    CodeEditorComponent,
    PipelineCardComponent,
    PipelineComponent,
    PipelinesComponent,
    PipelineEditorComponent,
    PipelineExplorerComponent,
    PipelineItemComponent,
    PipelineTestFormComponent,
    PipelineTestResultsComponent
  ],
  exports: []
})
export class IngestPipelineModule {}
