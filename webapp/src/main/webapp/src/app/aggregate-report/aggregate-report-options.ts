export interface AggregateReportOptions {

  assessmentGrades: CodedEntity[];
  assessmentTypes: CodedEntity[];
  completenesses: CodedEntity[];
  ethnicities: CodedEntity[];
  genders: CodedEntity[];
  interimAdministrationConditions: CodedEntity[];
  schoolYears: number[];
  subjects: CodedEntity[];
  summativeAdministrationConditions: CodedEntity[];

}

export interface CodedEntity {

  readonly id: number;
  readonly code: string;

}
