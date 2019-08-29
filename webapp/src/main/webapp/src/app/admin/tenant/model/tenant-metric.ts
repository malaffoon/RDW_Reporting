export interface TenantMetric {
  type: TenantMetricType;
  schoolYear: number;
  subjectCode?: string;
  count: number;
}

export type TenantMetricType = 'Subjects' | 'Students' | 'Schools';
