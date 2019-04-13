import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { getOrAppendAsyncScript } from '../../ingest-pipeline.support';
import { controlValueAccessorProvider } from '../../../../shared/form/forms';
import { ControlValueAccessor } from '@angular/forms';
import { map } from 'rxjs/operators';

declare var ace: any;

@Component({
  selector: 'code-editor',
  templateUrl: './code-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [controlValueAccessorProvider(CodeEditorComponent)]
})
export class CodeEditorComponent implements ControlValueAccessor, OnDestroy {
  @ViewChild('editor')
  editorElementReference: ElementRef;

  @Output()
  errors: EventEmitter<any> = new EventEmitter();

  _editor: any;

  ngOnDestroy(): void {
    this.errors.complete();
  }

  @Input()
  set language(value: string) {
    this.withEditor(editor => {
      editor.getSession().setMode('ace/mode/' + value);
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
      editor.setValue(value);
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
              highlightActiveLine: true,
              highlightSelectedWord: true,
              minLines: 30,
              maxLines: Infinity,
              tabSize: 2,
              theme: 'ace/theme/dracula'
            })
          )
        )
        .subscribe(editor => {
          editor.getSession().on('changeAnnotation', change => {
            if (change != null && change.type === 'error') {
              this.errors.next(change);
            }
          });
          this._editor = editor;
          callback(editor);
        });
    }
  }
}
