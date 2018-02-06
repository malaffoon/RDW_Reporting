import { Organization } from "../../shared/organization/organization";

/**
 * This model represents an aggregate report data table row result.
 */
export class AggregateReportItem {
  itemId: number;
  assessmentId: number;
  /** @deprecated */ gradeId: number;
  gradeCode: string;
  /** @deprecated */ subjectId: number;
  subjectCode: string;
  schoolYear: number;
  avgScaleScore: number;
  avgStdErr: number;
  studentsTested: any;
  /** @deprecated */ performanceLevelCounts: number[] = [];
  /** @deprecated */ performanceLevelPercents: number[] = [];
  /** @deprecated */ groupedPerformanceLevelCounts: number[] = [];
  /** @deprecated */ groupedPerformanceLevelPercents: number[] = [];
  preformanceLevelByDisplayTypes: {
    [performanceLevelDisplayType: string]: {
      [valueDisplayType: string]: number[]
    }
  } = {
    Separate: {
      Number: [],
      Percent: []
    },
    Grouped: {
      Number: [],
      Percent: []
    }
  };
  organization: Organization;
  /** @deprecated */ dimensionType: string;
  /** @deprecated */ dimensionValue: string;
  dimension: Dimension;
}

/**
 * Holds dimension information for display as a report item
 */
export interface Dimension {
  readonly type: string;
  readonly includeType?: boolean;
  readonly code?: string;
  readonly codeTranslationCode?: string;
}
