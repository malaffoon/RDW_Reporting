import { Component, ElementRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
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
import { tap } from 'rxjs/internal/operators/tap';
import {
  Message,
  MessageType
} from '../../component/code-editor/code-editor.component';
import {
  Item,
  ItemType
} from '../../component/pipeline-explorer/pipeline-explorer.component';

const defaultCompileDebounceTime = 2000;

function compilationErrorToMessage(value: CompilationError): Message {
  return {
    type: <MessageType>'error',
    row: value.row,
    column: value.column,
    text: typeof value.message === 'string' ? value.message : value.message.code
  };
}

function createItems(pipeline: Pipeline): Item[] {
  return [
    {
      type: 'Script',
      value: pipeline
    },
    ...pipeline.tests.map(value => ({
      type: <ItemType>'Test',
      value
    }))
  ];
}

@Component({
  selector: 'pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.less']
})
export class PipelineComponent {
  pipeline: Pipeline;

  pipelineScriptBody: BehaviorSubject<string> = new BehaviorSubject('');

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

  testUpdating: boolean;

  items: Item[];
  selectedItem: Item;

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
        this.items = createItems(pipeline);
        this.selectedItem = this.items[0];
        this.testButtonDisabled = pipeline.tests.length === 0;
        this.published = false; // TODO
        this.publishButtonDisabled = this.published;
      });

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

  onScriptChange(value: string): void {
    this.pipelineScriptBody.next(value);
    this.saved = false;
    this.saveButtonDisabled = this._lastSavedScriptBody === value;
  }

  onScriptUpdate(pipeline: Pipeline): void {
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
              // TODO launch test result modal
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

  onTestRun(test: PipelineTest): void {
    // fail fast when compilation doesn't work
    const { pipeline } = this;
    this.testing = true;
    this.pipelineService
      .compilePipelineScript(pipeline.script.body)
      .subscribe(errors => {
        this.compilationErrors.next(errors);

        if (errors.length === 0) {
          this.pipelineService
            .runPipelineTest(pipeline.id, test.id, pipeline.script.body)
            .subscribe(results => {
              this.testResults = results;
              this.testing = false;
              // TODO launch test result modal
            });
        } else {
          this.testing = false;
        }
      });
  }

  onTestCreate(element: HTMLElement): void {
    const test = {
      input: '',
      output: ''
    };
    this.pipelineService
      .createPipelineTest(this.pipeline.id, test)
      .subscribe(test => {
        this.setPipelineTests([test, ...this.pipeline.tests]);
        // select added test
        this.selectedItem = this.items.find(
          ({ type, value: { id } }) => type === 'Test' && id === test.id
        );
      });
  }

  onTestUpdate(test: PipelineTest): void {
    this.testUpdating = true;
    this.pipelineService
      .updatePipelineTest(this.pipeline.id, test)
      .subscribe(() => {
        // update updated on?
        this.testUpdating = false;
      });
  }

  onTestDelete(test: PipelineTest): void {
    this.pipelineService
      .deletePipelineTest(this.pipeline.id, test.id)
      .subscribe(() => {
        // find and select next item
        const deletedTestIndex = this.items.findIndex(
          ({ type, value: { id } }) => type === 'Test' && id === test.id
        );

        this.setPipelineTests(
          this.pipeline.tests.filter(({ id }) => id !== test.id)
        );

        const nextTestItem = this.items.find(
          ({ type, value: { id } }, index) =>
            type === 'Test' && id !== test.id && index >= deletedTestIndex
        );

        this.selectedItem = nextTestItem != null ? nextTestItem : this.items[0];
      });
  }

  onItemSelected(item: Item): void {
    this.selectedItem = item;
  }

  private setPipelineTests(tests: PipelineTest[]): void {
    this.testButtonDisabled = this.testing || tests.length === 0;
    this.pipeline.tests = tests;
    this.items = createItems(this.pipeline);
    // TODO if new script we should select it
  }
}
