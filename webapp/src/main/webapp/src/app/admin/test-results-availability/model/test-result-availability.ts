export interface TestResultAvailability {
  readonly districtId: number;
  readonly districtName: string;
  readonly schoolYear: number;
  readonly subjectId: number;
  readonly subjectCode: string;
  readonly reportType: string;
  readonly status: string;
  readonly examCount?: number;
}
