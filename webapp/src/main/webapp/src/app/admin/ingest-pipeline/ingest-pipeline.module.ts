import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CodeEditorComponent } from './component/code-editor/code-editor.component';
import { ScriptsPageComponent } from './page/scripts/scripts-page.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ScriptPageComponent } from './page/script/script-page.component';
import { ScriptFormComponent } from './component/script-form/script-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree';
import { ScriptTreeComponent } from './component/script-tree/script-tree.component';
import { ScriptIdeComponent } from './component/script-ide/script-ide.component';

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
    ScriptFormComponent,
    ScriptPageComponent,
    ScriptsPageComponent,
    ScriptTreeComponent,
    ScriptIdeComponent
  ],
  exports: []
})
export class IngestPipelineModule {}
