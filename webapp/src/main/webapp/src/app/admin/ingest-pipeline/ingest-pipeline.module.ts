import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CodeEditorComponent } from './component/code-editor/code-editor.component';
import { ScriptsComponent } from './page/scripts/scripts.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ScriptComponent } from './page/script/script.component';
import { ScriptFormComponent } from './component/script-form/script-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree';
import { ScriptTreeComponent } from './component/script-tree/script-tree.component';
import { ScriptIdeComponent } from './component/script-ide/script-ide.component';
import { PipelinesComponent } from './page/pipelines/pipelines.component';
import { PipelineCardComponent } from './component/pipeline-card/pipeline-card.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    TranslateModule,
    ReactiveFormsModule,
    TreeModule
  ],
  declarations: [
    CodeEditorComponent,
    PipelineCardComponent,
    PipelinesComponent,
    ScriptFormComponent,
    ScriptComponent,
    ScriptsComponent,
    ScriptTreeComponent,
    ScriptIdeComponent
  ],
  exports: []
})
export class IngestPipelineModule {}
