import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { appendAsyncScriptToHeadIfAbsent } from '../../ingest-pipeline.support';
import { Script } from '../../model/script';

declare var ace: any;

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
  _editor: any;

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
