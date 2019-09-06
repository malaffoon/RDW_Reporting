import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { PipelineTest } from '../../model/pipeline';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { validate } from '../../../../shared/form/forms';
import { maxTextLength, pipelineTestFormGroup } from '../../model/pipelines';
import { xml } from '../../ingest-pipeline.support';

@Component({
  selector: 'pipeline-test-form',
  templateUrl: './pipeline-test-form.component.html',
  styleUrls: ['./pipeline-test-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PipelineTestFormComponent implements OnInit, OnDestroy {
  @Input()
  readonly: boolean;

  @Output()
  testChange: EventEmitter<PipelineTest> = new EventEmitter();

  _inputType: Subject<string> = new BehaviorSubject(undefined);
  _test: Subject<PipelineTest> = new BehaviorSubject(undefined);
  _formGroup: Observable<FormGroup>;
  _destroyed: Subject<void> = new Subject();

  @Input()
  set test(value: PipelineTest) {
    this._test.next(value);
  }

  @Input()
  set inputType(value: string) {
    this._inputType.next(value);
  }

  ngOnInit(): void {
    this._formGroup = combineLatest(
      this._test,
      this._inputType.pipe(
        distinctUntilChanged(),
        map(inputType => pipelineTestFormGroup(inputType))
      )
    ).pipe(
      takeUntil(this._destroyed),
      map(([test, formGroup]) => {
        formGroup.patchValue(test);

        // enable two-way binding
        Object.entries(formGroup.controls).forEach(([controlName, control]) => {
          control.valueChanges
            .pipe(
              takeUntil(this._destroyed),
              distinctUntilChanged()
            )
            .subscribe(change => {
              test[controlName] = change;
              this.testChange.emit(test);
            });
        });

        // start with validation
        validate(formGroup);

        return formGroup;
      })
    );
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
