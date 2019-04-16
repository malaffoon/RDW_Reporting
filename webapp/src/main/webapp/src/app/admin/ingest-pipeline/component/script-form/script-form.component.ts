import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { IngestPipelineScript } from '../../model/script';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { isEqual } from 'lodash';

@Component({
  selector: 'script-form',
  templateUrl: './script-form.component.html',
  styleUrls: ['./script-form.component.less']
})
export class ScriptFormComponent {
  formGroup: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    language: new FormControl('groovy', [Validators.required]),
    body: new FormControl('')
  });

  @Output()
  scriptUpdated: EventEmitter<IngestPipelineScript> = new EventEmitter();

  @Input()
  set script(value: IngestPipelineScript) {
    if (!isEqual(value, this.formGroup.value)) {
      this.formGroup.patchValue(value);
    }
  }

  @Input()
  set readonly(value: boolean) {
    if (value) {
      this.formGroup.disable();
    } else {
      this.formGroup.enable();
    }
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.scriptUpdated.emit(this.formGroup.value);
    }
  }
}
