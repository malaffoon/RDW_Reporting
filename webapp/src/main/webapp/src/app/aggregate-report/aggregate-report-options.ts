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

}

export interface CodedEntity {

  readonly id: number;
  readonly code: string;

}
