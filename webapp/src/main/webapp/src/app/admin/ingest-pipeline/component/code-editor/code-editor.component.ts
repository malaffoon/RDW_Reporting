import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { appendAsyncScriptToHeadIfAbsent } from '../../ingest-pipeline.support';
import * as ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-groovy';
import 'ace-builds/src-noconflict/theme-dracula';
import { Script } from '../../model/script';

/**
 * Loads lazily loaded dependencies of the component
 */
function requireDependencies(onLoad: () => void): void {
  appendAsyncScriptToHeadIfAbsent('ace-editor.js', onLoad);
}

@Component({
  selector: 'code-editor',
  templateUrl: './code-editor.component.html'
})
export class CodeEditorComponent {
  @ViewChild('editor')
  editorElementReference: ElementRef;

  _script: Script;
  _editor: ace.Ace.Editor;

  constructor() {}

  @Input()
  set script(value: Script) {
    this._script = value;
    requireDependencies(() => {
      this._editor = ace.edit(this.editorElementReference.nativeElement, {
        highlightActiveLine: true,
        highlightSelectedWord: true,
        minLines: 30,
        maxLines: Infinity,
        tabSize: 2,
        mode: 'ace/mode/' + value.language,
        theme: 'ace/theme/dracula',
        value: value.body
      });
    });
  }
}
