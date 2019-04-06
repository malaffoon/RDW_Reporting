import { AssessmentType, assessmentTypes } from './model/assessment-type';
import { gradeCodes } from './model/grade-codes';

const colors: string[] = [
  'teal',
  'green',
  'orange',
  'blue-dark',
  'maroon',
  'green-dark',
  'blue-dark'
];

export function color(index: number): string {
  return colors[index % colors.length];
}

export function gradeColor(gradeCode: string): string {
  const index = gradeCodes.indexOf(gradeCode);
  return color(index >= 0 ? index : 0);
}

export function assessmentTypeColor(assessmentType: AssessmentType): string {
  const index = assessmentTypes.indexOf(assessmentType);
  return color(index >= 0 ? index + 1 : assessmentTypes.length);
}
