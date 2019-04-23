import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputType, PipelineTest } from '../../model/pipeline';

@Component({
  selector: 'pipeline-test-form',
  templateUrl: './pipeline-test-form.component.html',
  styleUrls: ['./pipeline-test-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PipelineTestFormComponent {
  @Input()
  inputType: InputType;

  formGroup = new FormGroup({
    input: new FormControl('', [Validators.required]),
    output: new FormControl('', [Validators.required])
  });

  @Input()
  set test(value: PipelineTest) {
    this.formGroup.patchValue({
      input: value.input,
      output: value.output
    });
  }
}
