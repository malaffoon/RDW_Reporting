import { IngestPipelineScript } from './script';
import { InputType } from './input-type';

export interface IngestPipeline {
  id: number;
  name: string;
  description: string;
  updatedOn: Date;
  updatedBy: string;

  inputType: InputType;
  script?: IngestPipelineScript;
}
