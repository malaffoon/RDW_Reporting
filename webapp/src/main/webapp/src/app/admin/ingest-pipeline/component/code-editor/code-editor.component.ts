import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';
import { getOrAppendAsyncScript } from '../../ingest-pipeline.support';
import { controlValueAccessorProvider } from '../../../../shared/form/forms';
import { ControlValueAccessor } from '@angular/forms';
import { map } from 'rxjs/operators';

declare var ace: any;

export type MessageType = 'error' | 'information' | 'warning';

export interface Message {
  type: MessageType;
  row: number;
  column: number;
  text: string;
  raw?: any;
}

export type ThemeType = 'light' | 'dark';

const aceThemeByThemeType = {
  light: 'xcode',
  dark: 'dracula'
};

@Component({
  selector: 'code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [controlValueAccessorProvider(CodeEditorComponent)]
})
export class CodeEditorComponent implements ControlValueAccessor {
  @ViewChild('editor')
  editorElementReference: ElementRef;

  _editor: any;

  @Input()
  set language(value: string) {
    this.withEditor(editor => {
      editor.getSession().setMode('ace/mode/' + value);
    });
  }

  @Input()
  set messages(values: Message[]) {
    this.withEditor(editor => {
      editor.getSession().setAnnotations(values);
    });
  }

  @Input()
  set theme(value: ThemeType) {
    this.withEditor(editor => {
      editor.setTheme(`ace/theme/${aceThemeByThemeType[value]}`);
    });
  }

  registerOnChange(fn: any): void {
    this.withEditor(editor => {
      editor.on('change', () => {
        fn(editor.getValue());
      });
    });
  }

  registerOnTouched(fn: any): void {
    this.withEditor(editor => {
      editor.on('blur', fn);
    });
  }

  setDisabledState(disabled: boolean): void {
    this.withEditor(editor => {
      editor.setReadOnly(disabled);
      editor.setHighlightActiveLine(!disabled);
      editor.setHighlightSelectedWord(!disabled);
    });
  }

  writeValue(value: any): void {
    this.withEditor(editor => {
      editor.setValue(value || '');
      editor.clearSelection();
    });
  }

  private withEditor(callback: (editor: any) => void): void {
    if (this._editor != null) {
      callback(this._editor);
    } else {
      getOrAppendAsyncScript('ace-editor.js')
        .pipe(
          map(() =>
            ace.edit(this.editorElementReference.nativeElement, {
              highlightActiveLine: false,
              highlightSelectedWord: true,
              minLines: 35,
              maxLines: 35,
              tabSize: 2,
              showLineNumbers: false,
              showFoldWidgets: false,
              theme: aceThemeByThemeType.light,
              // ext-language_tools
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: false
            })
          )
        )
        .subscribe(editor => {
          this._editor = editor;
          callback(editor);
        });
    }
  }
}
