import { Component } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  pipe,
  Subject
} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  debounceTime,
  map,
  mergeMap,
  share,
  switchMap,
  takeUntil
} from 'rxjs/operators';
import { PipelineService } from '../../service/pipeline.service';
import {
  CompilationError,
  Pipeline,
  PipelineTest,
  TestResult
} from '../../model/pipeline';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { PipelineEditorTab } from '../../component/pipeline-editor/pipeline-editor.component';
import { tap } from 'rxjs/internal/operators/tap';
import {
  Message,
  MessageType
} from '../../component/code-editor/code-editor.component';

const ViewParameterName = 'view';
const defaultLanguage = 'text';
const defaultCompileDebounceTime = 2000;

const tests = [1, 2, 3, 4, 5].map((id, index) => ({
  createdOn: new Date(),
  name: `Test ${id}`,
  description: `
  Mumblecore tousled roof party godard helvetica
  palo santo brunch meggings hoodie direct trade
  cray food truck. You probably haven't heard of
  tofu shaman synth hell of locavore.
  `
}));

function compilationErrorToMessage(value: CompilationError): Message {
  return {
    type: <MessageType>'error',
    row: value.row,
    column: value.column,
    text: typeof value.message === 'string' ? value.message : value.message.code
  };
}

@Component({
  selector: 'pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.less']
})
export class PipelineComponent {
  readonly tests = tests;
  activeTest: number;

  pipeline: Pipeline;

  pipelineScriptBody: BehaviorSubject<string> = new BehaviorSubject('');

  tab: Observable<PipelineEditorTab>;

  messages: Observable<Message[]>;

  compiling: boolean;
  compilationErrors: BehaviorSubject<CompilationError[]> = new BehaviorSubject(
    []
  );

  saving: boolean;
  saved: boolean = true;
  saveButtonDisabled: boolean = true;

  testing: boolean;
  tested: boolean;
  testResults: TestResult[];
  testButtonDisabled: boolean = true;

  publishing: boolean;
  published: boolean;
  publishButtonDisabled: boolean = true;

  private _lastSavedScriptBody: string;
  private _destroyed: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pipelineService: PipelineService
  ) {
    this.route.params
      .pipe(
        mergeMap(({ id }) =>
          forkJoin(
            this.pipelineService.getPipeline(id),
            this.pipelineService.getPipelineScript(id, 1),
            this.pipelineService.getPipelineTests(id)
          )
        ),
        map(([pipeline, script, tests]) => ({
          ...pipeline,
          script,
          tests
        }))
      )
      .subscribe(pipeline => {
        this._lastSavedScriptBody = pipeline.script.body;
        this.pipeline = pipeline;
        this.testButtonDisabled = pipeline.tests.length === 0;
        this.published = false; // TODO
        this.publishButtonDisabled = this.published;
      });

    this.tab = this.route.queryParams.pipe(
      map(({ [ViewParameterName]: view }) => view || 'Script')
    );

    this.pipelineScriptBody
      .pipe(
        takeUntil(this._destroyed),
        debounceTime(defaultCompileDebounceTime),
        tap(() => {
          this.compiling = true;
        }),
        switchMap(value => this.pipelineService.compilePipelineScript(value)),
        share()
      )
      .subscribe(errors => {
        this.compiling = false;
        this.compilationErrors.next(errors);
      });

    this.messages = this.compilationErrors.pipe(
      takeUntil(this._destroyed),
      map(errors => errors.map(error => compilationErrorToMessage(error)))
    );
  }

  ngOnDestroy(): void {
    this.compilationErrors.complete();
    this._destroyed.next();
    this._destroyed.complete();
  }

  onTabClick(view: PipelineEditorTab): void {
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {
        [ViewParameterName]: view
      },
      replaceUrl: true
    });
  }

  onScriptChange(value: string): void {
    this.pipelineScriptBody.next(value);
    this.saved = false;
    this.saveButtonDisabled = this._lastSavedScriptBody === value;
  }

  onScriptSave(pipeline: Pipeline): void {
    this.saving = true;
    this.pipelineService
      .updatePipelineScript(pipeline.id, pipeline.script)
      .subscribe(script => {
        this._lastSavedScriptBody = script.body; // because this doesn't use next() we dont get "saved"
        this.saving = false;
        this.saved = true;
        this.saveButtonDisabled = true;
      });
  }

  onScriptTest(pipeline: Pipeline): void {
    // fail fast when compilation doesn't work
    this.testing = true;
    this.pipelineService
      .compilePipelineScript(pipeline.script.body)
      .subscribe(errors => {
        this.compilationErrors.next(errors);

        if (errors.length === 0) {
          this.pipelineService
            .runPipelineTests(pipeline.id, pipeline.script.body)
            .subscribe(results => {
              this.testResults = results;
              this.testing = false;
              this.tested = true;
            });
        } else {
          this.testing = false;
        }
      });
  }

  onScriptPublish(pipeline: Pipeline): void {
    this.publishing = true;
    this.pipelineService
      .compilePipelineScript(pipeline.script.body)
      .subscribe(errors => {
        this.compilationErrors.next(errors);

        if (errors.length === 0) {
          this.pipelineService
            .runPipelineTests(pipeline.id, pipeline.script.body)
            .subscribe(results => {
              this.testResults = results;

              if (results.every(({ passed }) => passed)) {
                this.pipelineService
                  .publishPipelineScript(pipeline.id, pipeline.script)
                  .subscribe(script => {
                    this.pipeline.script = script;
                    this.publishing = false;
                    this.published = true;
                    this.publishButtonDisabled = this.published;
                  });
              } else {
                this.publishing = false;
              }
            });
        } else {
          this.publishing = false;
        }
      });
  }

  onTestCreated(test: PipelineTest): void {
    this.pipelineService
      .createPipelineTest(this.pipeline.id, test)
      .subscribe(test => {
        this.setPipelineTests([...this.pipeline.tests, test]);
      });
  }

  onTestUpdated(test: PipelineTest): void {
    this.pipelineService
      .updatePipelineTest(this.pipeline.id, test)
      .subscribe(test => {
        this.setPipelineTests(
          this.pipeline.tests.map(x => (x.id === test.id ? test : x))
        );
      });
  }

  onTestDeleted(test: PipelineTest): void {
    this.pipelineService
      .deletePipelineTest(this.pipeline.id, test.id)
      .subscribe(() => {
        this.setPipelineTests(
          this.pipeline.tests.filter(({ id }) => id !== test.id)
        );
      });
  }

  private setPipelineTests(tests: PipelineTest[]): void {
    this.pipeline.tests = tests;
    this.testButtonDisabled = this.testing || tests.length === 0;
  }
}
