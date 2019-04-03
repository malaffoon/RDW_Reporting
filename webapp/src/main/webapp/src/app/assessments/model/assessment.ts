import { AssessmentType } from './assessment-type';

export interface Assessment {
  id: number;
  name: string;
  label: string;
  grade: string;
  type: AssessmentType;
  subject: string;
  alternateScoreCodes: string[];
  claimCodes: string[];
  cutPoints: number[];
  hasWerItem: boolean;
  targetReportEnabled: boolean;
  resourceUrl: string;
  /** @deprecated TODO this does not belong here but in a UI wrapper */
  selected?: boolean;
}
