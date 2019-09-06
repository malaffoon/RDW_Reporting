import { NameField } from '../provider/name-field.provider';
import { SchoolYearField } from '../provider/school-year-field.provider';
import { OrderField } from '../provider/order-field.provider';
import { AssessmentTypeField } from '../provider/assessment-type-field.provider';
import { LanguageField } from '../provider/language-field.provider';
import { SubjectField } from '../provider/subject-field.provider';
import { AccommodationsField } from '../provider/accommodations-field-provider';
import { TransferAccessField } from '../provider/transfer-access-field.provider';
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportQueryType } from '../report';
import { TranslateService } from '@ngx-translate/core';
import { Student } from '../../student/model/student.model';
import { School } from '../../shared/organization/organization';
import { Grade } from '../../school-grade/grade.model';
import { Group } from '../../groups/group';
import { FormField, FormMapper } from '../../shared/form/form';

/**
 * Code-configured metadata surrounding report-query specific forms
 */
export interface ReportQueryMetadata {
  /**
   * The form field dependency references
   */
  fields: InjectionToken<Observable<FormField>>[];

  /**
   * Used to convert a report query to and from its form data representation
   */
  mapper: FormMapper;
}

const SingleStudentPrintableReportOptions: InjectionToken<
  Observable<FormField>
>[] = [
  NameField,
  SchoolYearField,
  AssessmentTypeField,
  SubjectField,
  AccommodationsField,
  LanguageField,
  TransferAccessField
];

const MultiStudentPrintableReportOptions: InjectionToken<
  Observable<FormField>
>[] = [
  NameField,
  SchoolYearField,
  AssessmentTypeField,
  SubjectField,
  OrderField,
  AccommodationsField,
  LanguageField,
  TransferAccessField
];

const PrintableReportFormMapper: FormMapper = {
  toState: query => ({
    name: query.name,
    schoolYear: query.schoolYear,
    language: query.language,
    order: query.order,
    accommodations: query.accommodationsVisible,
    assessmentType: query.assessmentTypeCode,
    transferAccess: !query.disableTransferAccess,
    subject: query.subjectCode
  }),
  fromState: state => ({
    name: state.name,
    schoolYear: state.schoolYear,
    language: state.language,
    order: state.order,
    accommodationsVisible: state.accommodations,
    assessmentTypeCode: state.assessmentType,
    disableTransferAccess: !state.transferAccess,
    subjectCode: state.subject
  })
};

export const ReportQueryMetadataByType: Map<
  ReportQueryType,
  ReportQueryMetadata
> = new Map<ReportQueryType, ReportQueryMetadata>([
  [
    'Student',
    {
      fields: SingleStudentPrintableReportOptions,
      mapper: PrintableReportFormMapper
    }
  ],
  [
    'SchoolGrade',
    {
      fields: MultiStudentPrintableReportOptions,
      mapper: PrintableReportFormMapper
    }
  ],
  [
    'Group',
    {
      fields: MultiStudentPrintableReportOptions,
      mapper: PrintableReportFormMapper
    }
  ]
]);

/**
 * Shared convenience method for providing a default name for single-student reports
 *
 * @param translate The translation service used to format the name
 * @param student The student used to name the report
 */
export function createDefaultStudentPrintableReportName(
  translate: TranslateService,
  student: Student
): string {
  const studentLabel =
    student.firstName != null || student.lastName != null
      ? translate.instant('common.person-name', student)
      : student.ssid;
  return studentLabel;
}

/**
 * Shared convenience method used for providing a default name for school-grade reports
 *
 * @param translate The translation service used to format the name
 * @param school The school used for the name
 * @param grade The grade used for the name
 */
export function createDefaultSchoolGradePrintableReportName(
  translate: TranslateService,
  school: School,
  grade: Grade
): string {
  const gradeLabel = translate.instant(
    `common.assessment-grade-short-label.${grade.code}`
  );
  return `${school.name} ${gradeLabel}`;
}

/**
 * Shared convenience method used for providing a default name for group reports
 *
 * @param translate The translation service used to format the name
 * @param group The group used for the name
 */
export function createDefaultGroupSchoolGradePrintableReportName(
  translate: TranslateService,
  group: Group
): string {
  return group.name;
}
