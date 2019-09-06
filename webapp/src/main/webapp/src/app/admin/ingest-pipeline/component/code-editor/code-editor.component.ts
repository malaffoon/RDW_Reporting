import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { getOrAppendAsyncScript } from '../../ingest-pipeline.support';
import { controlValueAccessorProvider } from '../../../../shared/form/forms';
import { ControlValueAccessor } from '@angular/forms';
import { map } from 'rxjs/operators';

declare var ace: any;
declare var UndoManager: any;

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

const modesByInputType = {
  groovy: 'ace/mode/groovy',
  xml: 'ace/mode/xml'
};

@Component({
  selector: 'code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [controlValueAccessorProvider(CodeEditorComponent)]
})
export class CodeEditorComponent
  implements ControlValueAccessor, AfterViewInit {
  @Output()
  scrollTopChange: EventEmitter<number> = new EventEmitter();

  @ViewChild('editor')
  editorElementReference: ElementRef;

  _editor: any;

  ngAfterViewInit(): void {
    this.withEditor(editor => {
      // makes room for the escape prompt
      editor.renderer.setScrollMargin(20, 0);
    });
  }

  @Input()
  set language(value: string) {
    const mode = modesByInputType[value];
    if (mode != null) {
      this.withEditor(editor => {
        editor.getSession().setMode(mode);
      });
    }
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

  @Input()
  set lines(value: number) {
    this.withEditor(editor => {
      editor.setOptions({
        minLines: value,
        maxLines: value
      });
    });
  }

  @Input()
  set gutter(value: boolean) {
    this.withEditor(editor => {
      editor.setOptions({
        showGutter: value
      });
    });
  }

  @Input()
  set readonly(value: any) {
    this.withEditor(editor => {
      editor.setReadOnly(value);
    });
  }

  @Input()
  set scrollTop(value: any) {
    this.withEditor(editor => {
      editor.getSession().setScrollTop(parseInt(value) || 0);
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
      // start change history after initialization
      editor.getSession().setUndoManager(new ace.UndoManager());
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
              showLineNumbers: true,
              showFoldWidgets: false,
              theme: `ace/theme/${aceThemeByThemeType.light}`,
              // ext-language_tools
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: false
            })
          )
        )
        .subscribe(editor => {
          this._editor = editor;
          editor
            .getSession()
            .on('changeScrollTop', scrollTop =>
              this.scrollTopChange.emit(scrollTop)
            );
          callback(editor);
        });
    }
  }
}
