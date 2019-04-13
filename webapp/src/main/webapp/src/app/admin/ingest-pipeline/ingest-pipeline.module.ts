import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CodeEditorComponent } from './component/code-editor/code-editor.component';
import { ScriptsPageComponent } from './page/scripts/scripts-page.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ScriptPageComponent } from './page/script/script-page.component';
import { ScriptFormComponent } from './component/script-form/script-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [BrowserModule, RouterModule, TranslateModule, ReactiveFormsModule],
  declarations: [
    CodeEditorComponent,
    ScriptFormComponent,
    ScriptPageComponent,
    ScriptsPageComponent
  ],
  exports: []
})
export class IngestPipelineModule {}
