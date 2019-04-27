import { Component, HostListener } from '@angular/core';
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
  PipelineScript,
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
import { cloneDeep, isEqual } from 'lodash';
import { ComponentCanDeactivate } from '../../guard/unsaved-changes.guard';

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
    createItem('Script', pipeline.script, pipeline.description),
    ...pipeline.tests.map(value => createItem('Test', value))
  ];
}

function createItem<T>(type: ItemType, value: T, label?: string): Item<T> {
  if (label == null) {
    label = type === 'Test' ? (<PipelineTest>value).name : '';
  }
  return {
    type,
    label,
    value,
    lastSavedValue: cloneDeep(value)
  };
}

@Component({
  selector: 'pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.less']
})
export class PipelineComponent implements ComponentCanDeactivate {
  pipeline: Pipeline;

  pipelineScriptBody: BehaviorSubject<string> = new BehaviorSubject('');

  messages: Observable<Message[]>;

  compiling: boolean;
  compilationErrors: BehaviorSubject<CompilationError[]> = new BehaviorSubject(
    []
  );

  saving: boolean;
  saved: boolean = true;

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
  selectedItemLoading: boolean;

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
        this.pipeline = pipeline;
        this.items = createItems(pipeline);
        this.setSelectedItem(this.items[0]);
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

  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    return this.items.every(({ changed }) => !changed);
  }

  onScriptChange(value: string): void {
    this.pipelineScriptBody.next(value);
    this.saved = false;
    this.selectedItem.changed = !isEqual(
      this.selectedItem.value,
      this.selectedItem.lastSavedValue
    );
  }

  onScriptUpdate(script: PipelineScript): void {
    this.saving = true;
    const item = this.selectedItem;
    this.pipelineService
      .updatePipelineScript(this.pipeline.id, script)
      .subscribe(script => {
        this.saving = false;
        this.saved = true;
        item.lastSavedValue = cloneDeep(script);
        item.changed = false;
      });
  }

  onScriptTest(script: PipelineScript): void {
    // fail fast when compilation doesn't work
    this.testing = true;
    this.pipelineService
      .compilePipelineScript(script.body)
      .subscribe(errors => {
        this.compilationErrors.next(errors);

        if (errors.length === 0) {
          this.pipelineService
            .runPipelineTests(this.pipeline.id, script.body)
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

  onScriptPublish(script: PipelineScript): void {
    this.publishing = true;
    this.pipelineService
      .compilePipelineScript(script.body)
      .subscribe(errors => {
        this.compilationErrors.next(errors);

        if (errors.length === 0) {
          this.pipelineService
            .runPipelineTests(this.pipeline.id, script.body)
            .subscribe(results => {
              this.testResults = results;

              if (results.every(({ passed }) => passed)) {
                this.pipelineService
                  .publishPipelineScript(this.pipeline.id, script)
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

  onTestChange(item: Item<PipelineTest>): void {
    this.selectedItem.changed = !isEqual(
      this.selectedItem.value,
      this.selectedItem.lastSavedValue
    );
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

  onTestCreate(): void {
    this.pipelineService
      .createPipelineTest(this.pipeline.id, {
        input: '',
        output: ''
      })
      .subscribe(test => {
        this.setPipelineTests([test, ...this.pipeline.tests]);
        this.items = [createItem('Test', test), ...this.items];
        // select added item
        this.selectedItem = this.items.find(
          ({ type, value: { id } }) => type === 'Test' && id === test.id
        );
      });
  }

  onTestUpdate(test: PipelineTest): void {
    this.testUpdating = true;
    const item = this.selectedItem;
    this.pipelineService
      .updatePipelineTest(this.pipeline.id, test)
      .subscribe(() => {
        // update updated on?
        item.lastSavedValue = cloneDeep(test);
        item.changed = false;
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

        this.items = this.items.filter(
          ({ type, value: { id } }) => type !== 'Test' || id !== test.id
        );

        const nextTestItem = this.items.find(
          ({ type, value: { id } }, index) =>
            type === 'Test' && id !== test.id && index >= deletedTestIndex
        );

        this.setSelectedItem(
          nextTestItem != null ? nextTestItem : this.items[0]
        );
      });
  }

  onItemSelected(item: Item): void {
    this.selectedItem = item;
    // lazy load item content
    if (item.type === 'Script' && item.value == null) {
      this.selectedItemLoading = true;
      this.pipelineService
        .getPipelineScript(this.pipeline.id, 1)
        .subscribe(script => {
          item.value = script;
          item.lastSavedValue = cloneDeep(script);
          item.changed = false;
          this.selectedItemLoading = false;
        });
    } else if (item.type === 'Test' && item.value.input == null) {
      this.selectedItemLoading = true;
      this.pipelineService
        .getPipelineTest(this.pipeline.id, item.value.id)
        .subscribe(test => {
          // merge here is only needed because of stubbing
          const value = {
            ...test,
            ...item.value
          };
          item.value = value;
          item.lastSavedValue = cloneDeep(value);
          item.changed = false;
          this.selectedItemLoading = false;
        });
    }
  }

  private setSelectedItem(item: Item): void {
    this.onItemSelected(item);
  }

  private setPipelineTests(tests: PipelineTest[]): void {
    this.testButtonDisabled = this.testing || tests.length === 0;
    this.pipeline.tests = tests;
  }
}
