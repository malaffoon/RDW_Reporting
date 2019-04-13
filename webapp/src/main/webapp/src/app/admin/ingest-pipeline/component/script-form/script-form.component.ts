import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IngestPipelineScript } from '../../model/script';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'script-form',
  templateUrl: './script-form.component.html',
  styleUrls: ['./script-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScriptFormComponent {
  formGroup: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    language: new FormControl('groovy', [Validators.required]),
    body: new FormControl('')
  });

  @Input()
  set script(value: IngestPipelineScript) {
    this.formGroup.patchValue(value);
  }

  onSubmit(): void {
    console.log('saving', this.formGroup.value);
  }
}
