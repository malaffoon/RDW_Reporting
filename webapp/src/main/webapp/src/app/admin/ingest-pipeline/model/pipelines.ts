import { PipelineTest } from './pipeline';
import { isBlank } from '../../../shared/support/support';
import { Validators } from '@angular/forms';

const maximumTextLength = 65535;

export const maxTextLength = Validators.maxLength(maximumTextLength);

function isValidPipelineTextText(value: string): boolean {
  return !isBlank(value) && value.length <= maximumTextLength;
}

export function isValidPipelineTest(value: PipelineTest): boolean {
  return (
    (value.input == null || isValidPipelineTextText(value.input)) &&
    (value.output == null || isValidPipelineTextText(value.output))
  );
}
