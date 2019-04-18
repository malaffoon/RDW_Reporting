import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { PipelineScript } from '../../model/pipeline';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  debounceTime,
  map,
  share,
  startWith,
  switchMap,
  takeUntil
} from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { PipelineService } from '../../service/pipeline.service';
import { of } from 'rxjs/internal/observable/of';
import { Message, MessageType } from '../code-editor/code-editor.component';

const defaultLanguage = 'text';
const defaultCompileDebounceTime = 2000;

@Component({
  selector: 'pipeline-form',
  templateUrl: './pipeline-form.component.html',
  styleUrls: ['./pipeline-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PipelineFormComponent implements OnInit, OnDestroy {
  @Input()
  compileDebounceTime = defaultCompileDebounceTime;

  formGroup: FormGroup = new FormGroup({
    language: new FormControl(defaultLanguage, [Validators.required]),
    body: new FormControl('')
  });

  compiling: BehaviorSubject<boolean>;
  compileErrors: Observable<any[]>;
  messages: Observable<Message[]>;
  testButtonDisabled: Observable<boolean>;
  saveButtonDisabled: Observable<boolean>;
  publishButtonDisabled: Observable<boolean>;
  private _destroyed: Subject<void> = new Subject();

  constructor(private pipelineService: PipelineService) {
    this.compiling = <BehaviorSubject<boolean>>new BehaviorSubject(false).pipe(
      takeUntil(this._destroyed),
      share()
    );

    const body: AbstractControl = this.formGroup.get('body');
    this.compileErrors = body.valueChanges.pipe(
      takeUntil(this._destroyed),
      startWith(body.value),
      debounceTime(this.compileDebounceTime),
      tap(() => {
        this.compiling.next(true);
      }),
      switchMap(value => this.pipelineService.compilePipelineScript(value)),
      tap(() => {
        this.compiling.next(false);
      }),
      share()
    );

    this.messages = this.compileErrors.pipe(
      map(errors =>
        errors.map(error => ({
          type: <MessageType>'error',
          row: error.row,
          column: error.column,
          text: error.message.code
        }))
      )
    );

    this.testButtonDisabled = of(false);
    this.saveButtonDisabled = of(false);
    this.publishButtonDisabled = combineLatest(
      this.compiling,
      this.compileErrors
    ).pipe(
      takeUntil(this._destroyed),
      map(([compiling, compileErrors]) => compiling || compileErrors.length > 0)
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  @Input()
  set script(value: PipelineScript) {
    this.formGroup.patchValue(value);
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      console.log('onSubmit', this.formGroup.value);
    }
  }
}
