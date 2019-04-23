import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy
} from '@angular/core';
import { CompilationError, Pipeline, TestResult } from '../../model/pipeline';
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
import { Message, MessageType } from '../code-editor/code-editor.component';
import { Router } from '@angular/router';

const defaultLanguage = 'text';
const defaultCompileDebounceTime = 2000;

function compilationErrorToMessage(value: CompilationError): Message {
  return {
    type: <MessageType>'error',
    row: value.row,
    column: value.column,
    text: typeof value.message === 'string' ? value.message : value.message.code
  };
}

@Component({
  selector: 'pipeline-form',
  templateUrl: './pipeline-form.component.html',
  styleUrls: ['./pipeline-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PipelineFormComponent implements OnDestroy {
  @Input()
  compileDebounceTime = defaultCompileDebounceTime;

  formGroup: FormGroup = new FormGroup({
    language: new FormControl(defaultLanguage, [Validators.required]),
    body: new FormControl('')
  });

  compiling: BehaviorSubject<boolean> = new BehaviorSubject(false);
  compilationErrors: BehaviorSubject<CompilationError[]> = new BehaviorSubject(
    []
  );

  testing: BehaviorSubject<boolean> = new BehaviorSubject(false);
  testResults: BehaviorSubject<TestResult[]> = new BehaviorSubject([]);

  saving: BehaviorSubject<boolean> = new BehaviorSubject(false);
  saved: Observable<boolean>;

  messages: Observable<Message[]>;
  testButtonDisabled: Observable<boolean>;
  saveButtonDisabled: Observable<boolean>;
  publishButtonDisabled: Observable<boolean>;

  private _lastSavedScriptBody: string;
  private _pipeline: Pipeline;
  private _destroyed: Subject<void> = new Subject();

  constructor(
    private pipelineService: PipelineService,
    private router: Router
  ) {
    const body: AbstractControl = this.formGroup.get('body');
    body.valueChanges
      .pipe(
        takeUntil(this._destroyed),
        startWith(body.value),
        debounceTime(this.compileDebounceTime),
        tap(() => {
          this.compiling.next(true);
        }),
        switchMap(value => this.pipelineService.compilePipelineScript(value)),
        share()
      )
      .subscribe(errors => {
        this.compiling.next(false);
        this.compilationErrors.next(errors);
      });
    this.messages = this.compilationErrors.pipe(
      map(errors => errors.map(error => compilationErrorToMessage(error)))
    );

    this.testButtonDisabled = this.testing;

    this.saved = body.valueChanges.pipe(
      map(value => this._lastSavedScriptBody === value)
    );
    this.saveButtonDisabled = combineLatest(this.saving, this.saved).pipe(
      takeUntil(this._destroyed),
      tap(([saving, saved]) => console.log({ saving, saved })),
      map(([saving, saved]) => saving || saved)
    );

    this.publishButtonDisabled = combineLatest(
      this.compiling,
      this.compilationErrors,
      this.testing,
      this.testResults
    ).pipe(
      takeUntil(this._destroyed),
      map(
        ([compiling, compileErrors, testing, testResults]) =>
          compiling ||
          compileErrors.length > 0 ||
          testing ||
          testResults.length > 0
      )
    );
  }

  ngOnDestroy(): void {
    this.compiling.complete();
    this.compilationErrors.complete();
    this.testing.complete();
    this.testResults.complete();
    this.saving.complete();

    this._destroyed.next();
    this._destroyed.complete();
  }

  @Input()
  set pipeline(value: Pipeline) {
    this._pipeline = value;
    this._lastSavedScriptBody = value.script.body;
    this.formGroup.patchValue(value.script);
  }

  onTestButtonClick(): void {
    const { body: scriptBody } = this.formGroup.value;

    // fail fast when compilation doesn't work
    this.compiling.next(true);
    this.testing.next(true);
    this.pipelineService.compilePipelineScript(scriptBody).subscribe(errors => {
      this.compilationErrors.next(errors);
      this.compiling.next(false);

      if (errors.length === 0) {
        this.pipelineService
          .runPipelineTests(this._pipeline.id, scriptBody)
          .subscribe(results => {
            this.testResults.next(results);
            this.testing.next(false);
          });
      } else {
        this.testing.next(false);
      }
    });
  }

  onSaveButtonClick(): void {
    this.saving.next(true);
    this.pipelineService
      .updatePipelineScript(this._pipeline.id, {
        ...this._pipeline.script,
        ...this.formGroup.value
      })
      .subscribe(script => {
        this._lastSavedScriptBody = script.body;
        this.saving.next(false);
      });
  }

  onPublishButtonClick(): void {}
}
