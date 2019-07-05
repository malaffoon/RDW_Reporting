import { NgModule } from '@angular/core';
import { CodeEditorComponent } from './component/code-editor/code-editor.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipelinesComponent } from './page/pipelines/pipelines.component';
import { PipelineCardComponent } from './component/pipeline-card/pipeline-card.component';
import { PipelineComponent } from './page/pipeline/pipeline.component';
import { ReportingCommonModule } from '../../shared/reporting-common.module';
import { PipelineEditorComponent } from './component/pipeline-editor/pipeline-editor.component';
import {
  BsDropdownModule,
  ButtonsModule,
  ModalModule,
  TooltipModule
} from 'ngx-bootstrap';
import { PipelineExplorerComponent } from './component/pipeline-explorer/pipeline-explorer.component';
import { PipelineTestResultsComponent } from './component/pipeline-test-results/pipeline-test-results.component';
import { PipelineItemComponent } from './component/pipeline-item/pipeline-item.component';
import { CodeDifferenceComponent } from './component/code-difference/code-difference.component';
import { PipelineTestFormComponent } from './component/pipeline-test-form/pipeline-test-form.component';
import { PipelineTestResultComponent } from './component/pipeline-test-result/pipeline-test-result.component';
import { PipelinePublishingHistoryComponent } from './page/pipeline-publishing-history/pipeline-publishing-history.component';
import { PipelinePublishedScriptsComponent } from './component/pipeline-published-scripts/pipeline-published-scripts.component';
import { CommonModule } from '@angular/common';
import { translateModuleConfiguration } from '../../shared/translate-module-configuration';
import { ingestPipelineRoutes } from './ingest-pipeline.routes';

@NgModule({
  imports: [
    CommonModule,
    ReportingCommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonsModule,
    BsDropdownModule,
    ModalModule,
    TooltipModule,
    TranslateModule.forChild(translateModuleConfiguration),
    RouterModule.forChild(ingestPipelineRoutes)
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
    PipelinePublishedScriptsComponent,
    PipelinePublishingHistoryComponent,
    PipelineTestFormComponent,
    PipelineTestResultComponent,
    PipelineTestResultsComponent
  ],
  exports: []
})
export class IngestPipelineModule {}
