import {
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
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { tap } from 'rxjs/internal/operators/tap';

declare var ace: any;

@Component({
  selector: 'code-editor',
  templateUrl: './code-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [controlValueAccessorProvider(CodeEditorComponent)]
})
export class CodeEditorComponent implements ControlValueAccessor {
  @ViewChild('editor')
  editorElementReference: ElementRef;

  @Output()
  errors: EventEmitter<any> = new EventEmitter();

  editor: Observable<any> = getOrAppendAsyncScript('ace-editor.js').pipe(
    map(() =>
      ace.edit(this.editorElementReference.nativeElement, {
        highlightActiveLine: true,
        highlightSelectedWord: true,
        minLines: 30,
        maxLines: Infinity,
        tabSize: 2,
        theme: 'ace/theme/dracula'
      })
    ),
    tap(editor => {
      editor.getSession().on('changeAnnotation', change => {
        if (change != null && change.type === 'error') {
          this.errors.next(change);
        }
      });
    }),
    share()
  );

  ngOnDestroy(): void {
    this.errors.complete();
  }

  @Input()
  set language(value: string) {
    this.editor.subscribe(editor => {
      editor.getSession().setMode('ace/mode/' + value);
    });
  }

  registerOnChange(fn: any): void {
    this.editor.subscribe(editor => {
      editor.on('change', () => {
        fn(editor.getValue());
      });
    });
  }

  registerOnTouched(fn: any): void {
    this.editor.subscribe(editor => {
      editor.on('blur', fn);
    });
  }

  setDisabledState(disabled: boolean): void {
    this.editor.subscribe(editor => {
      editor.setReadOnly(disabled);
    });
  }

  writeValue(value: any): void {
    this.editor.subscribe(editor => {
      editor.setValue(value);
      editor.clearSelection();
    });
  }
}
