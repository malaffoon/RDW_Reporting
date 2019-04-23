import { Component, OnDestroy, OnInit } from '@angular/core';
import { PipelineService } from '../../service/pipeline.service';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import {
  BehaviorSubject,
  combineLatest,
  forkJoin,
  Observable,
  Subject
} from 'rxjs';
import { Pipeline, PipelineTest } from '../../model/pipeline';
import { map, takeUntil } from 'rxjs/operators';
import { PipelineTestsStore } from '../../store/pipeline-tests.store';
import { tap } from 'rxjs/internal/operators/tap';
import { of } from 'rxjs/internal/observable/of';

@Component({
  selector: 'pipeline-tests',
  templateUrl: './pipeline-tests.component.html'
})
export class PipelineTestsComponent implements OnInit, OnDestroy {
  pipeline: Observable<Pipeline>;
  selectedTest: Observable<PipelineTest>;
  private _destroyed: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pipelineService: PipelineService,
    private pipelineTestsStore: PipelineTestsStore
  ) {}

  ngOnInit(): void {
    this.pipeline = this.route.params.pipe(
      takeUntil(this._destroyed),
      mergeMap(({ id }) =>
        forkJoin(
          this.pipelineService.getPipeline(id),
          this.pipelineTestsStore.getState()
        ).pipe(
          map(([pipeline, tests]) => ({
            ...pipeline,
            tests
          }))
        )
      )
    );

    this.selectedTest = combineLatest(
      this.route.params,
      this.route.queryParams
    ).pipe(
      takeUntil(this._destroyed),
      mergeMap(([{ id }, { testId }]) =>
        testId === 'new'
          ? of({ name: '', input: '', output: '' })
          : this.pipelineService.getPipelineTest(id, testId)
      )
    );

    this.pipelineService
      .getPipelineTests(this.route.snapshot.params.id)
      .subscribe(tests => {
        this.pipelineTestsStore.setState(tests);
      });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  onTestClick(test: PipelineTest): void {
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {
        testId: test.id
      }
    });
  }
}
