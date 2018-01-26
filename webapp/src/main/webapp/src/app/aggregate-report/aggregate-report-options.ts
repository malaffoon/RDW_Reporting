export interface AggregateReportOptions {

  readonly assessmentGrades: CodedEntity[];
  readonly assessmentTypes: CodedEntity[];
  readonly completenesses: CodedEntity[];
  readonly ethnicities: CodedEntity[];
  readonly genders: CodedEntity[];
  readonly interimAdministrationConditions: CodedEntity[];
  readonly schoolYears: number[];
  readonly subjects: CodedEntity[];
  readonly summativeAdministrationConditions: CodedEntity[];

  readonly migrantStatuses: any[];
  readonly ieps: any[];
  readonly plan504s: any[];
  readonly limitedEnglishProficiencies: any[];
  readonly economicDisadvantages: any[];

  readonly dimensionTypes: string[];

  readonly statewideUser: boolean;

}

export interface CodedEntity {

  readonly id: number;
  readonly code: string;

}
