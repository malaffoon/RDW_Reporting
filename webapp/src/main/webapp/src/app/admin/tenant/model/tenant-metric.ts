export interface TenantMetric {
  type: TenantMetricType;
  schoolYear: number;
  subjectCode?: string;
  assessmentType?: string;
  count: number;
}

export type TenantMetricType = 'Subjects' | 'Students' | 'Schools';
