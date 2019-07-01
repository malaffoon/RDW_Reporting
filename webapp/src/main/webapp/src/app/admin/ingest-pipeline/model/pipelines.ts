import { PipelineTest } from './pipeline';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { xml } from '../ingest-pipeline.support';

const maximumTextLength = 65535;

export const maxTextLength = Validators.maxLength(maximumTextLength);

function getInputTypeValidators(inputType: string): ValidatorFn[] {
  if (inputType === 'xml') {
    return [xml];
  }
  return [];
}

function getInputOutputValidators(inputType: string): ValidatorFn[] {
  return [
    Validators.required,
    maxTextLength,
    ...getInputTypeValidators(inputType)
  ];
}

export function pipelineTestFormGroup(inputType: string): FormGroup {
  const inputOutputValidators: ValidatorFn[] = getInputOutputValidators(
    inputType
  );
  return new FormGroup({
    name: new FormControl(''),
    input: new FormControl('', inputOutputValidators),
    output: new FormControl('', inputOutputValidators)
  });
}

export function isValidPipelineTest(
  value: PipelineTest,
  inputType: string
): boolean {
  const formGroup = pipelineTestFormGroup(inputType);
  formGroup.patchValue(value);
  return formGroup.valid;
}
