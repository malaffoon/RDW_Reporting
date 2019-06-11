import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { InputType, PipelineTest } from '../../model/pipeline';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { validate } from '../../../../shared/form/forms';

const TextMaximumLength = 65535;

@Component({
  selector: 'pipeline-test-form',
  templateUrl: './pipeline-test-form.component.html',
  styleUrls: ['./pipeline-test-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PipelineTestFormComponent implements OnDestroy {
  static formGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl(''),
      input: new FormControl('', [
        Validators.required,
        Validators.maxLength(TextMaximumLength)
      ]),
      output: new FormControl('', [
        Validators.required,
        Validators.maxLength(TextMaximumLength)
      ])
    });
  }

  @Input()
  readonly: boolean;

  @Input()
  inputType: InputType;

  @Output()
  testChange: EventEmitter<PipelineTest> = new EventEmitter();

  _formGroup: FormGroup = PipelineTestFormComponent.formGroup();
  _destroyed: Subject<void> = new Subject();

  @Input()
  set test(value: PipelineTest) {
    this._formGroup.patchValue(value);

    // enable two-way binding
    Object.entries(this._formGroup.controls).forEach(
      ([controlName, control]) => {
        control.valueChanges
          .pipe(
            takeUntil(this._destroyed),
            distinctUntilChanged()
          )
          .subscribe(change => {
            value[controlName] = change;
            this.testChange.emit(value);
          });
      }
    );

    // start with validation
    validate(this._formGroup);
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
