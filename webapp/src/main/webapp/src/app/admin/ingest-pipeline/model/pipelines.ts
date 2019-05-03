import { PipelineTest } from './pipeline';
import { isBlank } from '../../../shared/support/support';

export function isValidPipelineTest(value: PipelineTest): boolean {
  return (
    (value.input == null || !isBlank(value.input)) &&
    (value.output == null || !isBlank(value.output))
  );
}
