import { Component, HostListener, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  debounceTime,
  filter,
  map,
  mergeMap,
  switchMap,
  takeUntil
} from 'rxjs/operators';
import { PipelineService } from '../../service/pipeline.service';
import {
  Pipeline,
  PipelineScript,
  PipelineTest,
  PipelineTestRun,
  PublishedScript,
  ScriptError
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
import { CompilationState, PipelineState } from '../../model/pipeline-state';
import { isValidPipelineTest } from '../../model/pipelines';
import { isNullOrBlank } from '../../../../shared/support/support';
import { of } from 'rxjs/internal/observable/of';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { DeleteModalComponent } from '../../../../report/component/delete-modal/delete-modal.component';
import { DatePipe } from '@angular/common';
import { ConfirmationModalComponent } from '../../../../shared/component/confirmation-modal/confirmation-modal.component';
import { UserService } from '../../../../shared/security/service/user.service';

const defaultCompileDebounceTime = 2000;

function compilationErrorToMessage(value: ScriptError): Message {
  return {
    type: <MessageType>'error',
    row: value.row != null ? value.row - 1 : 0,
    column: value.column != null ? value.column - 1 : undefined,
    text: value.message
  };
}

function createItems(
  pipeline: Pipeline,
  translateService: TranslateService
): Item<PipelineScript | PipelineTest>[] {
  return [
    createItem('Script', {
      ...pipeline.script,
      name: translateService.instant(
        `ingest-pipeline.${pipeline.code}.description`
      )
    }),
    ...pipeline.tests.map(value => createItem('Test', value))
  ];
}

function createItem<T>(type: ItemType, value: T, changed = false): Item<T> {
  return {
    type,
    value,
    lastSavedValue: cloneDeep(value),
    changed
  };
}

function isTestLoadedAndInvalid(
  test: PipelineTest,
  inputType: string
): boolean {
  return test.input != null && !isValidPipelineTest(test, inputType);
}

@Component({
  selector: 'pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.less'],
  providers: [DatePipe]
})
export class PipelineComponent implements ComponentCanDeactivate, OnDestroy {
  pipeline: Pipeline;

  pipelineScriptBody: BehaviorSubject<string> = new BehaviorSubject('');

  messages: Observable<Message[]>;

  compilationState: CompilationState;
  compilationErrors: BehaviorSubject<ScriptError[]> = new BehaviorSubject([]);

  saving: boolean;
  saveButtonDisabledTooltipCode: string;

  testState: PipelineState;
  testRuns: PipelineTestRun[];
  testButtonDisabled: boolean;
  testButtonDisabledTooltipCode: string;

  publishState: PipelineState;
  publishButtonDisabled: boolean;
  publishButtonDisabledTooltipCode: string;
  publishedScript: PublishedScript;
  published: boolean;

  hasPublishedPipelines: boolean;

  testUpdating: boolean;

  items: Item[];
  selectedItem: Item;
  selectedItemLoading: boolean;

  readonly: boolean;

  private _destroyed: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pipelineService: PipelineService,
    private userService: UserService,
    private translateService: TranslateService,
    private datePipe: DatePipe,
    private modalService: BsModalService
  ) {
    const pipeline = this.route.params.pipe(
      mergeMap(({ id }) => this.pipelineService.getPipeline(Number(id)))
    );

    combineLatest(
      <Observable<boolean>>(
        this.userService
          .getUser()
          .pipe(
            map(({ permissions }) => permissions.includes('PIPELINE_WRITE'))
          )
      ),
      <Observable<any>>(
        pipeline.pipe(
          mergeMap(pipeline =>
            forkJoin(
              of(pipeline),
              this.pipelineService
                .getPipelineScripts(pipeline.id)
                .pipe(map(scripts => scripts[0])),
              this.pipelineService.getPipelineTests(pipeline.id),
              this.pipelineService
                .getPublishedPipelines(pipeline.code)
                .pipe(map(pipelines => pipelines.length > 0)),
              pipeline.activeVersion != null
                ? this.pipelineService
                    .getPublishedPipeline(pipeline.code, pipeline.activeVersion)
                    .pipe(
                      map(published =>
                        published != null ? published.scripts[0] : null
                      )
                    )
                : of(null)
            )
          )
        )
      )
    )
      .pipe(takeUntil(this._destroyed))
      .subscribe(
        ([
          hasWritePermission,
          [basePipeline, script, tests, hasPublishedPipelines, publishedScript]
        ]) => {
          const pipeline = {
            ...basePipeline,
            // defensively assigns placeholder script so that the
            // sample script is looked up when the script item is selected
            script: script || {
              id: -1,
              pipelineId: basePipeline.id
            },
            tests
          };
          this.readonly = !hasWritePermission;
          this.hasPublishedPipelines = hasPublishedPipelines;
          this.publishedScript = publishedScript;
          this.pipeline = pipeline;
          this.published =
            publishedScript != null &&
            publishedScript.body === pipeline.script.body;
          this.items = createItems(pipeline, this.translateService);
          this.setSelectedItem(this.items[0]);
          this.updateButtonStates();
        }
      );

    this.pipelineScriptBody
      .pipe(
        takeUntil(this._destroyed),
        filter(value => !isNullOrBlank(value)),
        tap(() => {
          this.compilationState = null;
        }),
        debounceTime(defaultCompileDebounceTime),
        tap(() => {
          this.compilationState = 'Compiling';
        }),
        switchMap(value =>
          this.pipelineService.compilePipelineScript(this.pipeline.id, value)
        )
      )
      .subscribe(
        errors => {
          this.compilationState = errors.length === 0 ? null : 'Failed';
          this.compilationErrors.next(errors);
          this.updateButtonStates();
        },
        () => {
          this.compilationState = 'Failed';
          this.updateButtonStates();
        }
      );

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
    return (this.items || []).every(({ changed }) => !changed);
  }

  onScriptChange(value: string): void {
    this.published =
      this.publishedScript != null && this.publishedScript.body === value;
    this.pipelineScriptBody.next(value);
    this.selectedItem.changed = !isEqual(
      this.selectedItem.value,
      this.selectedItem.lastSavedValue
    );
    this.updateButtonStates();
  }

  onScriptUpdate(script: PipelineScript): void {
    this.saving = true;
    const item = this.selectedItem;

    const observable =
      script.id == null
        ? this.pipelineService.createPipelineScript({
            pipelineId: this.pipeline.id,
            body: script.body
          })
        : this.pipelineService.updatePipelineScript(script);

    observable.subscribe(script => {
      this.saving = false;
      script = {
        ...script,
        name: item.value.name
      };
      item.value = script;
      item.lastSavedValue = cloneDeep(script);
      item.changed = false;
      this.updateButtonStates();
    });
  }

  onScriptTest(script: PipelineScript): void {
    // fail fast when compilation doesn't work
    this.testState = 'Compiling';
    this.compilationState = null;
    this.pipelineService
      .compilePipelineScript(this.pipeline.id, script.body)
      .subscribe(errors => {
        this.compilationErrors.next(errors);
        if (errors.length === 0) {
          this.testState = 'Testing';
          this.pipelineService
            .runPipelineTests(this.pipeline.id)
            .subscribe(runs => {
              this.showTestResults(runs);
              this.testState = null;
            });
        } else {
          this.testState = null;
          this.compilationState = 'Failed';
          this.updateButtonStates();
        }
      });
  }

  onScriptPublish(script: PipelineScript): void {
    this.publishState = 'Compiling';
    this.compilationState = null;
    this.pipelineService
      .compilePipelineScript(this.pipeline.id, script.body)
      .subscribe(errors => {
        this.compilationErrors.next(errors);

        if (errors.length === 0) {
          this.publishState = 'Testing';
          this.pipelineService
            .runPipelineTests(this.pipeline.id)
            .subscribe(runs => {
              if (runs.every(({ result }) => result.passed)) {
                this.publishState = 'Publishing';
                this.pipelineService
                  .publishPipeline(this.pipeline.id)
                  .subscribe(published => {
                    const onDone = () => {
                      this.publishedScript = published.scripts[0];
                      this.publishButtonDisabled = true;
                      this.publishState = null;
                      this.router.navigate(['history'], {
                        relativeTo: this.route
                      });
                    };

                    const modalReference: BsModalRef = this.modalService.show(
                      ConfirmationModalComponent
                    );
                    const hiddenSubscription = this.modalService.onHidden.subscribe(
                      onDone
                    );

                    const onAccept = () => {
                      hiddenSubscription.unsubscribe();
                      this.pipelineService
                        .updatePipeline({
                          ...this.pipeline,
                          activeVersion: published.version
                        })
                        .subscribe(() => {
                          onDone();
                        });
                    };

                    const modal: ConfirmationModalComponent =
                      modalReference.content;
                    modal.head = this.translateService.instant(
                      'pipeline.activate-modal.head'
                    );
                    modal.body = this.translateService.instant(
                      'pipeline.activate-modal.body'
                    );
                    modal.acceptButton = this.translateService.instant(
                      'pipeline.activate-modal.accept'
                    );
                    modal.accept.subscribe(onAccept);
                  });
              } else {
                this.showTestResults(runs);
                this.publishState = null;
              }
            });
        } else {
          this.publishState = null;
          this.compilationState = 'Failed';
          this.updateButtonStates();
        }
      });
  }

  onTestChange(item: Item<PipelineTest>): void {
    this.selectedItem.changed = !isEqual(
      this.selectedItem.value,
      this.selectedItem.lastSavedValue
    );
    this.updateButtonStates();
  }

  onTestRun(test: PipelineTest): void {
    // fail fast when compilation doesn't work
    const { pipeline } = this;
    this.testState = 'Compiling';
    this.compilationState = null;
    this.pipelineService
      .compilePipelineScript(
        this.pipeline.id,
        this.items.find(({ type }) => type === 'Script').value.body
      )
      .subscribe(errors => {
        this.compilationErrors.next(errors);
        if (errors.length === 0) {
          this.testState = 'Testing';
          this.pipelineService
            .runPipelineTest(pipeline.id, test.id)
            .subscribe(runs => {
              this.showTestResults(runs);
              this.testState = null;
            });
        } else {
          this.testState = null;
          this.compilationState = 'Failed';
          this.updateButtonStates();
        }
      });
  }

  onTestCreate(): void {
    this.userService.getUser().subscribe(user => {
      const updatedBy = `${user.firstName} ${user.lastName}`;
      const test: PipelineTest = {
        pipelineId: this.pipeline.id,
        createdOn: new Date(),
        updatedBy,
        input: '',
        output: ''
      };
      this.setPipelineTests([test, ...this.pipeline.tests]);
      this.items = [
        ...this.items.filter(({ type }) => type === 'Script'),
        createItem('Test', test, true),
        ...this.items.filter(({ type }) => type === 'Test')
      ];
      // select added item
      this.selectedItem = this.items.find(
        ({ type, value: { id } }) => type === 'Test' && id === test.id
      );
      this.updateButtonStates();
    });
  }

  onTestUpdate(test: PipelineTest): void {
    this.testUpdating = true;
    const item = this.selectedItem;

    const observable =
      test.id == null
        ? this.pipelineService.createPipelineTest(test)
        : this.pipelineService.updatePipelineTest(test);

    observable.subscribe(value => {
      // update updated on?
      item.value = value;
      item.lastSavedValue = cloneDeep(value);
      item.changed = false;
      this.testUpdating = false;
      this.updateButtonStates();
    });
  }

  onTestDelete(item: Item<PipelineTest>): void {
    // used to select the next available item
    const deletedTestIndex = this.items.findIndex(x => x === item);

    const onDelete = () => {
      // remove the item
      this.items = this.items.filter(x => x !== item);

      // remove test from pipeline (TODO not sure this is needed anymore)
      this.setPipelineTests(
        this.pipeline.tests.filter(
          x => x !== item.value && x.id !== item.value.id
        )
      );

      // select the next available item
      const nextTestItem = this.items.find(
        (x, index) =>
          x !== item && x.type === 'Test' && index >= deletedTestIndex
      );
      this.setSelectedItem(nextTestItem != null ? nextTestItem : this.items[0]);
    };

    if (item.value.id != null) {
      const modalReference: BsModalRef = this.modalService.show(
        DeleteModalComponent
      );
      const modal: DeleteModalComponent = modalReference.content;
      modal.messageId = 'delete-modal.body-generic';
      modal.name = isNullOrBlank(item.value.name)
        ? this.datePipe.transform(item.value.createdOn, 'medium')
        : item.value.name;
      modal.deleted.subscribe(() => {
        this.pipelineService.deletePipelineTest(item.value).subscribe(() => {
          onDelete();
        });
      });
    } else {
      onDelete();
    }
  }

  onItemSelected(item: Item): void {
    this.selectedItem = item;
    // lazy load item content
    if (
      item.type === 'Script' &&
      (item.value.id != null && item.value.body == null)
    ) {
      this.selectedItemLoading = true;
      this.pipelineService
        .getPipelineScript(this.pipeline.id, item.value.id)
        .subscribe(script => {
          script = {
            ...script,
            name: item.value.name // keep the computed name
          };
          item.value = script;
          item.lastSavedValue = cloneDeep(script);
          item.changed = false;
          this.selectedItemLoading = false;
          this.updateButtonStates();
        });
    } else if (
      item.type === 'Test' &&
      (item.value.id != null && item.value.input == null)
    ) {
      this.selectedItemLoading = true;
      this.pipelineService
        .getPipelineTest(this.pipeline.id, item.value.id)
        .subscribe(value => {
          item.value = value;
          item.lastSavedValue = cloneDeep(value);
          item.changed = false;
          this.selectedItemLoading = false;
          this.updateButtonStates();
        });
    } else {
      this.updateButtonStates();
    }
  }

  onCloseTestResultsButtonClick(): void {
    this.testRuns = undefined;
  }

  private setSelectedItem(item: Item): void {
    this.onItemSelected(item);
  }

  private setPipelineTests(tests: PipelineTest[]): void {
    this.pipeline.tests = tests;
    this.updateButtonStates();
  }

  private updateButtonStates(): void {
    // TODO need to move back to reactive approach with observables to make this simpler

    this.saveButtonDisabledTooltipCode = '';

    const scripts = this.items.filter(({ type }) => type === 'Script');
    const tests = this.items.filter(({ type }) => type === 'Test');

    // need to catch placeholder script and loaded sample script - they have invalid IDs
    const scriptIsBlank = scripts.some(
      ({ value: { id, body } }) => id == null || id < 0 || isNullOrBlank(body)
    );

    const compilationFailed = this.compilationState === 'Failed';

    // The complication here is that when editing the script we should enforce everything be saved before allowing "run tests"
    // however, in the case that you are editing a single test you would want to allow the test to be run if the script and that test are saved
    const hasUnsavedChanges =
      scripts.some(({ changed }) => changed) ||
      (this.selectedItem.type === 'Script'
        ? tests.some(({ changed }) => changed)
        : this.selectedItem.changed);

    // dont run
    const hasInvalidTests =
      this.selectedItem.type === 'Test'
        ? isTestLoadedAndInvalid(
            this.selectedItem.value,
            this.pipeline.inputType
          )
        : tests.some(({ value }) =>
            isTestLoadedAndInvalid(value, this.pipeline.inputType)
          );

    this.testButtonDisabled =
      scriptIsBlank ||
      compilationFailed ||
      this.testState != null ||
      tests.length === 0 ||
      hasInvalidTests ||
      hasUnsavedChanges;

    this.testButtonDisabledTooltipCode = !this.testButtonDisabled
      ? ''
      : scriptIsBlank
      ? 'pipeline.no-script'
      : compilationFailed
      ? 'pipeline.compilation-failed'
      : tests.length === 0
      ? 'pipeline.no-tests'
      : hasInvalidTests
      ? 'pipeline.invalid-tests'
      : hasUnsavedChanges
      ? 'pipeline.unsaved-changes'
      : '';

    this.publishButtonDisabled =
      scriptIsBlank ||
      compilationFailed ||
      this.publishState != null ||
      this.published ||
      tests.length === 0 ||
      hasInvalidTests ||
      this.items.some(({ changed }) => changed);

    this.publishButtonDisabledTooltipCode = !this.publishButtonDisabled
      ? ''
      : scriptIsBlank
      ? 'pipeline.no-script'
      : compilationFailed
      ? 'pipeline.compilation-failed'
      : this.published
      ? 'pipeline.published'
      : this.pipeline.tests.length === 0
      ? 'pipeline.no-tests'
      : hasInvalidTests
      ? 'pipeline.invalid-tests'
      : 'pipeline.publish-unsaved-changes';
  }

  private showTestResults(runs: PipelineTestRun[]): void {
    const runWithErrors = runs.find(
      ({ result: { scriptErrors } }) =>
        scriptErrors != null && scriptErrors.length > 0
    );
    if (runWithErrors != null) {
      this.selectedItem = this.items.find(({ type }) => type === 'Script');
      this.compilationErrors.next(runWithErrors.result.scriptErrors);
    } else {
      this.testRuns = runs;
    }
  }
}
