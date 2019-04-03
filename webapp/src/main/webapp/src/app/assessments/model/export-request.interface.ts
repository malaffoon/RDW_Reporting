import { RequestType } from '../../shared/enum/request-type.enum';
import { Assessment } from './assessment';

export interface ExportRequest {
  assessment: Assessment;
  type: RequestType;
}
