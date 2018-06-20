import { Injectable } from '@angular/core';
import { AssessmentExam } from '../assessments/model/assessment-exam.model';
import { FilterBy } from '../assessments/model/filter-by.model';
import { Exam } from '../assessments/model/exam.model';
import { ExamFilterService } from '../assessments/filters/exam-filters/exam-filter.service';
import { CsvBuilder } from './csv-builder.service';
import { StudentHistoryExamWrapper } from '../student/model/student-history-exam-wrapper.model';
import { Student } from '../student/model/student.model';
import { ExportItemsRequest } from '../assessments/model/export-items-request.model';
import { RequestType } from '../shared/enum/request-type.enum';
import { ExportWritingTraitsRequest } from '../assessments/model/export-writing-trait-request.model';
import { ExportTargetReportRequest } from '../assessments/model/export-target-report-request.model';
import { SubjectService } from '../subject/subject.service';

@Injectable()
export class CsvExportService {

  constructor(private examFilterService: ExamFilterService,
              private csvBuilder: CsvBuilder,
              private subjectService: SubjectService) {
  }

  /**
   * Export a filtered collection of AssessmentExams as a CSV download.
   *
   * @param assessmentExams The source AssessmentExam instances
   * @param filterBy        The filter criteria
   * @param filename        The export file name
   */
  exportAssessmentExams(assessmentExams: AssessmentExam[],
                        filterBy: FilterBy,
                        ethnicities: string[],
                        filename: string) {
    const sourceData: any[] = [];

    // TODO: Is this filter needed?  I think we pass in the filtered exam collection we wouldn't need to
    // TODO: apply the filter yet again here.
    assessmentExams.forEach((assessmentExam: AssessmentExam) => {
      const filteredExams = this.examFilterService.filterExams(assessmentExam.exams, assessmentExam.assessment, filterBy);
      filteredExams.forEach((exam) => {
        sourceData.push({
          assessment: assessmentExam.assessment,
          exam: exam
        });
      });
    });

    const getStudent = (item) => item.exam.student;
    const getExam = (item) => item.exam;
    const getAssessment = (item) => item.assessment;
    const getIABExam = (item) => item.assessment.isIab ? item.exam : null;
    const getNonIABExam = (item) => item.assessment.isIab ? null : item.exam;

    this.subjectService.getSubjectDefinitions().subscribe(definitions => {

      const builder = this.csvBuilder.newBuilder()
        .withFilename(filename)
        .withStudent(getStudent)
        .withExamDateAndSession(getExam)
        .withSchool(getExam)
        .withSchoolYear(getExam)
        .withAssessmentTypeNameAndSubject(getAssessment)
        .withExamGradeAndStatus(getExam)
        .withAchievementLevel(getNonIABExam)
        .withReportingCategory(getAssessment, getIABExam)
        .withScoreAndErrorBand(getExam);

      // TODO: Makes repeated columns because we don't know that subject+assessmentType combos share scorable claims
      definitions.forEach(definition => {
        builder.withClaimScores(
          definition.subject,
          definition.scorableClaims,
          getAssessment,
          (item) => !item.assessment.isIab && item.assessment.subject === definition.subject ? item.exam : null
        );
      });

      builder
        .withGender(getStudent)
        .withStudentContext(getExam, ethnicities)
        .withAccommodationCodes(getExam)
        .build(sourceData);
    });
  }

  /**
   * Export a collection of StudentHistoryExamWrapper instances as a CSV download.
   *
   * @param wrappers    The exam history wrappers
   * @param getStudent  A student provider
   * @param filename    The export csv filename
   */
  exportStudentHistory(wrappers: StudentHistoryExamWrapper[],
                       getStudent: () => Student,
                       filename: string) {

    const getExam = (wrapper: StudentHistoryExamWrapper) => wrapper.exam;
    const getAssessment = (wrapper: StudentHistoryExamWrapper) => wrapper.assessment;
    const getIABExam = (wrapper: StudentHistoryExamWrapper) => wrapper.assessment.isIab ? wrapper.exam : null;
    const getNonIABExam = (wrapper: StudentHistoryExamWrapper) => wrapper.assessment.isIab ? null : wrapper.exam;

    this.subjectService.getSubjectDefinitions().subscribe(definitions => {
      const builder = this.csvBuilder.newBuilder()
        .withFilename(filename)
        .withStudent(getStudent)
        .withExamDateAndSession(getExam)
        .withSchool(getExam)
        .withSchoolYear(getExam)
        .withAssessmentTypeNameAndSubject(getAssessment)
        .withExamGradeAndStatus(getExam)
        .withAchievementLevel(getNonIABExam)
        .withReportingCategory(getAssessment, getIABExam)
        .withScoreAndErrorBand(getExam)

      // TODO: Makes repeated columns because we don't know that subject+assessmentType combos share scorable claims
      definitions.forEach(definition => {
        builder.withClaimScores(
          definition.subject,
          definition.scorableClaims,
          getAssessment,
          (item) => !item.assessment.isIab && item.assessment.subject === definition.subject ? item.exam : null
        );
      });

      builder
        .withAccommodationCodes(getExam)
        .build(wrappers);
    });
  }

  exportResultItems(exportRequest: ExportItemsRequest,
                    filename: string) {

    let getAssessment = () => exportRequest.assessment;
    let getAssessmentItem = (item) => item;

    let builder = this.csvBuilder
      .newBuilder()
      .withFilename(filename)
      .withAssessmentTypeNameAndSubject(getAssessment)
      .withItemNumber(getAssessmentItem)
      .withClaim(getAssessmentItem)
      .withTarget(getAssessmentItem)
      .withItemDifficulty(getAssessmentItem)
      .withStandards(getAssessmentItem)
      .withFullCredit(getAssessmentItem, exportRequest.showAsPercent);

      if (exportRequest.type == RequestType.DistractorAnalysis) {
        builder = builder.withItemAnswerKey(getAssessmentItem)
      }

      builder.withPoints(getAssessmentItem, exportRequest.pointColumns, exportRequest.showAsPercent)
      .build(exportRequest.assessmentItems);
  }

  exportWritingTraitScores(exportRequest: ExportWritingTraitsRequest,
                           filename: string) {

    let compositeRows: any[] = [];
    let maxPoints: number = 0;

    exportRequest.assessmentItems.forEach((item, i) => {

      exportRequest.summaries[i].rows.forEach(summary => {
        compositeRows.push({
          assessmentItem: item,
          writingTraitAggregate: summary
        });

        if (summary.trait.maxPoints > maxPoints) maxPoints = summary.trait.maxPoints;
      });

    });

    let getAssessmentItem = (item) => item.assessmentItem;

    this.csvBuilder
      .newBuilder()
      .withFilename(filename)
      .withAssessmentTypeNameAndSubject(() => exportRequest.assessment)
      .withClaim(getAssessmentItem)
      .withTarget(getAssessmentItem)
      .withItemDifficulty(getAssessmentItem)
      .withStandards(getAssessmentItem)
      .withFullCredit(getAssessmentItem, exportRequest.showAsPercent)
      .withPerformanceTaskWritingType(getAssessmentItem)
      .withWritingTraitAggregate((item) => item.writingTraitAggregate, maxPoints, exportRequest.showAsPercent)
      .build(compositeRows);
  }

  exportTargetScoresToCsv(exportRequest: ExportTargetReportRequest,
                           filename: string) {

    this.csvBuilder
      .newBuilder()
      .withFilename(filename)
      .withGroupName(() => exportRequest.group)
      .withSchoolYear(() => <Exam>{ schoolYear: exportRequest.schoolYear})
      .withAssessmentTypeNameAndSubject(() => exportRequest.assessment)
      .withScoreAndErrorBand(() => <Exam>{ score: exportRequest.averageScaleScore, standardError: exportRequest.standardError})
      .withTargetReportAggregate((item) => item)
      .build(exportRequest.targetScoreRows);

  }
}
