import { Injectable } from '@angular/core';
import { AssessmentExam } from '../assessments/model/assessment-exam.model';
import { FilterBy } from '../assessments/model/filter-by.model';
import { Exam } from '../assessments/model/exam';
import { ExamFilterService } from '../assessments/filters/exam-filters/exam-filter.service';
import { CsvBuilder } from './csv-builder.service';
import { StudentHistoryExamWrapper } from '../student/model/student-history-exam-wrapper.model';
import { Student } from '../student/model/student.model';
import { ExportItemsRequest } from '../assessments/model/export-items-request.model';
import { RequestType } from '../shared/enum/request-type.enum';
import { ExportWritingTraitsRequest } from '../assessments/model/export-writing-trait-request.model';
import { ExportTargetReportRequest } from '../assessments/model/export-target-report-request.model';
import { Assessment } from '../assessments/model/assessment';
import { ordering } from '@kourge/ordering';
import { ranking } from '@kourge/ordering/comparator';
import { forkJoin } from 'rxjs';
import { SubjectService } from '../subject/subject.service';
import { isNullOrEmpty } from '../shared/support/support';
import { ExamSearchFilterService } from '../exam/service/exam-search-filter.service';
import { ReportingEmbargoService } from '../shared/embargo/reporting-embargo.service';

/**
 * Represents a specific type of score for an assessment (e.g. claim, alternate)
 * This is used when collecting information about what score codes exist and what columns to add to the CSV
 */
interface AssessmentScoreType {
  subjectCode: string;
  assessmentTypeCode: string;
  codes: string[];
}

/**
 * Gets the score codes for the given assessment holding values
 *
 * @param values The assessment holders
 * @param subjectCodes All system subject codes used for sorting
 * @param getAssessment Method to get the assessment from the value
 * @param getScoreCodes Method to get the score codes from the assessment
 */
function getScoreCodes<T>(
  values: T[],
  subjectCodes: string[],
  getAssessment: (value: T) => Assessment,
  getScoreCodes: (assessment: Assessment) => string[]
): AssessmentScoreType[] {
  return (values || [])
    .reduce((scoreCodes: AssessmentScoreType[], value: T) => {
      const assessment = getAssessment(value);
      if (assessment != null && !isNullOrEmpty(getScoreCodes(assessment))) {
        const { subject: subjectCode, type: assessmentTypeCode } = assessment;
        const score = scoreCodes.find(
          score => score.subjectCode === subjectCode
        );
        if (score == null) {
          scoreCodes.push({
            subjectCode,
            assessmentTypeCode,
            codes: getScoreCodes(assessment).slice()
          });
        }
      }
      return scoreCodes;
    }, [])
    .sort(
      ordering(ranking(subjectCodes)).on(({ subjectCode }) => subjectCode)
        .compare
    );
}

@Injectable()
export class CsvExportService {
  constructor(
    private examFilterService: ExamFilterService,
    private csvBuilder: CsvBuilder,
    private subjectService: SubjectService,
    private examSearchFilterService: ExamSearchFilterService,
    private embargoService: ReportingEmbargoService
  ) {}

  /**
   * Export a filtered collection of AssessmentExams as a CSV download.
   *
   * @param assessmentExams The source AssessmentExam instances
   * @param filterBy        The filter criteria
   * @param filename        The export file name
   */
  exportAssessmentExams(
    assessmentExams: AssessmentExam[],
    filterBy: FilterBy,
    filename: string
  ) {
    let sourceData: any[] = [];

    // TODO: Is this filter needed?  I think we pass in the filtered exam collection we wouldn't need to
    // TODO: apply the filter yet again here.
    assessmentExams.forEach((assessmentExam: AssessmentExam) => {
      const filteredExams = this.examFilterService.filterExams(
        assessmentExam.exams,
        assessmentExam.assessment,
        filterBy
      );
      filteredExams.forEach(exam => {
        sourceData.push({
          assessment: assessmentExam.assessment,
          exam: exam
        });
      });
    });

    const getStudent = item => item.exam.student;
    const getExam = item => item.exam;
    const getAssessment = item => item.assessment;
    const getNonIABAssessment = item =>
      item.assessment.type === 'iab' ? null : item.assessment;
    const getIABExam = item =>
      item.assessment.type === 'iab' ? item.exam : null;
    const getNonIABExam = item =>
      item.assessment.type === 'iab' ? null : item.exam;

    forkJoin(
      this.subjectService.getSubjectCodes(),
      this.subjectService.getSubjectDefinitions(),
      this.examSearchFilterService.getExamSearchFilters(),
      this.embargoService.isEmbargoed()
    ).subscribe(
      ([subjectCodes, subjectDefinitions, examSearchFilters, embargoed]) => {
        // filter out embargoed exams
        if (embargoed) {
          sourceData = sourceData.filter(
            ({ assessment }) => assessment.type !== 'sum'
          );
        }

        const builder = this.csvBuilder
          .newBuilder()
          .withFilename(filename)
          .withStudent(getStudent)
          .withExamDateAndSession(getExam)
          .withSchool(getExam)
          .withSchoolYear(getExam)
          .withAssessmentTypeNameAndSubject(getAssessment)
          .withExamGradeAndStatus(getExam)
          .withAchievementLevel(getNonIABAssessment, getNonIABExam)
          .withReportingCategory(getAssessment, getIABExam)
          .withScoreAndErrorBand(getExam);

        // alternate score codes
        getScoreCodes(
          sourceData,
          subjectCodes,
          getAssessment,
          ({ alternateScoreCodes }) => alternateScoreCodes
        ).forEach(score => {
          const { alternateScore } = subjectDefinitions.find(
            ({ subject, assessmentType }) =>
              subject === score.subjectCode &&
              assessmentType === score.assessmentTypeCode
          );

          if (alternateScore != null) {
            builder.withAlternateScores(
              score.subjectCode,
              score.codes
                .slice()
                .sort(ordering(ranking(alternateScore.codes)).compare),
              getAssessment,
              item =>
                item.assessment.subject === score.subjectCode &&
                item.assessment.type === score.assessmentTypeCode
                  ? item.exam
                  : null
            );
          }
        });

        // claim scores
        getScoreCodes(
          sourceData,
          subjectCodes,
          getAssessment,
          ({ claimCodes }) => claimCodes
        ).forEach(score => {
          const { claimScore } = subjectDefinitions.find(
            ({ subject, assessmentType }) =>
              subject === score.subjectCode &&
              assessmentType === score.assessmentTypeCode
          );

          if (claimScore != null) {
            builder.withClaimScores(
              score.subjectCode,
              score.codes
                .slice()
                .sort(ordering(ranking(claimScore.codes)).compare),
              getAssessment,
              item =>
                item.assessment.subject === score.subjectCode &&
                item.assessment.type === score.assessmentTypeCode
                  ? item.exam
                  : null
            );
          }
        });

        builder
          .withStudentContext(
            getExam,
            getStudent,
            examSearchFilters.studentFilters
          )
          .withAccommodationCodes(getExam)
          .build(sourceData);
      }
    );
  }

  /**
   * Export a collection of StudentHistoryExamWrapper instances as a CSV download.
   *
   * @param wrappers    The exam history wrappers
   * @param getStudent  A student provider
   * @param filename    The export csv filename
   */
  exportStudentHistory(
    wrappers: StudentHistoryExamWrapper[],
    getStudent: () => Student,
    filename: string
  ) {
    const getExam = (wrapper: StudentHistoryExamWrapper) => wrapper.exam;
    const getAssessment = (wrapper: StudentHistoryExamWrapper) =>
      wrapper.assessment;
    const getNonIABAssessment = item =>
      item.assessment.type === 'iab' ? null : item.assessment;
    const getIABExam = (wrapper: StudentHistoryExamWrapper) =>
      wrapper.assessment.type === 'iab' ? wrapper.exam : null;
    const getNonIABExam = (wrapper: StudentHistoryExamWrapper) =>
      wrapper.assessment.type === 'iab' ? null : wrapper.exam;

    forkJoin(
      this.subjectService.getSubjectCodes(),
      this.subjectService.getSubjectDefinitions(),
      this.embargoService.isEmbargoed()
    ).subscribe(([subjectCodes, subjectDefinitions, embargoed]) => {
      // filter out embargoed results
      if (embargoed) {
        wrappers = (wrappers || []).filter(
          ({ assessment }) => assessment.type !== 'sum'
        );
      }

      const builder = this.csvBuilder
        .newBuilder()
        .withFilename(filename)
        .withStudent(getStudent)
        .withExamDateAndSession(getExam)
        .withSchool(getExam)
        .withSchoolYear(getExam)
        .withAssessmentTypeNameAndSubject(getAssessment)
        .withExamGradeAndStatus(getExam)
        .withAchievementLevel(getNonIABAssessment, getNonIABExam)
        .withReportingCategory(getAssessment, getIABExam)
        .withScoreAndErrorBand(getExam);

      // alternate score codes
      getScoreCodes(
        wrappers,
        subjectCodes,
        getAssessment,
        ({ alternateScoreCodes }) => alternateScoreCodes
      ).forEach(score => {
        const { alternateScore } = subjectDefinitions.find(
          ({ subject, assessmentType }) =>
            subject === score.subjectCode &&
            assessmentType === score.assessmentTypeCode
        );

        if (alternateScore != null) {
          builder.withAlternateScores(
            score.subjectCode,
            score.codes
              .slice()
              .sort(ordering(ranking(alternateScore.codes)).compare),
            getAssessment,
            item =>
              item.assessment.subject === score.subjectCode &&
              item.assessment.type === score.assessmentTypeCode
                ? item.exam
                : null
          );
        }
      });

      // claim scores
      getScoreCodes(
        wrappers,
        subjectCodes,
        getAssessment,
        ({ claimCodes }) => claimCodes
      ).forEach(score => {
        const { claimScore } = subjectDefinitions.find(
          ({ subject, assessmentType }) =>
            subject === score.subjectCode &&
            assessmentType === score.assessmentTypeCode
        );

        if (claimScore != null) {
          builder.withClaimScores(
            score.subjectCode,
            score.codes
              .slice()
              .sort(ordering(ranking(claimScore.codes)).compare),
            getAssessment,
            item =>
              item.assessment.subject === score.subjectCode &&
              item.assessment.type === score.assessmentTypeCode
                ? item.exam
                : null
          );
        }
      });

      builder.withAccommodationCodes(getExam).build(wrappers);
    });
  }

  exportResultItems(exportRequest: ExportItemsRequest, filename: string) {
    const getAssessment = () => exportRequest.assessment;
    const getAssessmentItem = item => item;

    const builder = this.csvBuilder
      .newBuilder()
      .withFilename(filename)
      .withAssessmentTypeNameAndSubject(getAssessment)
      .withItemNumber(getAssessmentItem)
      .withClaim(getAssessment, getAssessmentItem)
      .withTarget(getAssessment, getAssessmentItem)
      .withItemDifficulty(getAssessmentItem)
      .withStandards(getAssessmentItem)
      .withFullCredit(getAssessmentItem, exportRequest.showAsPercent);

    if (exportRequest.type === RequestType.DistractorAnalysis) {
      builder.withItemAnswerKey(getAssessmentItem);
    }

    this.embargoService.isEmbargoed().subscribe(embargoed => {
      // filter out embargoed results
      if (embargoed && exportRequest.assessment.type === 'sum') {
        return;
      }

      builder
        .withPoints(
          getAssessmentItem,
          exportRequest.pointColumns,
          exportRequest.showAsPercent
        )
        .build(exportRequest.assessmentItems);
    });
  }

  exportWritingTraitScores(
    exportRequest: ExportWritingTraitsRequest,
    filename: string
  ) {
    const compositeRows: any[] = [];
    let maxPoints: number = 0;

    exportRequest.assessmentItems.forEach((item, i) => {
      exportRequest.summaries[i].rows.forEach(summary => {
        compositeRows.push({
          assessmentItem: item,
          writingTraitAggregate: summary
        });

        if (summary.trait.maxPoints > maxPoints)
          maxPoints = summary.trait.maxPoints;
      });
    });

    const getAssessment = () => exportRequest.assessment;
    const getAssessmentItem = item => item.assessmentItem;

    this.embargoService.isEmbargoed().subscribe(embargoed => {
      // filter out embargoed results
      if (embargoed && exportRequest.assessment.type === 'sum') {
        return;
      }

      this.csvBuilder
        .newBuilder()
        .withFilename(filename)
        .withAssessmentTypeNameAndSubject(getAssessment)
        .withClaim(getAssessment, getAssessmentItem)
        .withTarget(getAssessment, getAssessmentItem)
        .withItemDifficulty(getAssessmentItem)
        .withStandards(getAssessmentItem)
        .withFullCredit(getAssessmentItem, exportRequest.showAsPercent)
        .withPerformanceTaskWritingType(getAssessmentItem)
        .withWritingTraitAggregate(
          item => item.writingTraitAggregate,
          maxPoints,
          exportRequest.showAsPercent
        )
        .build(compositeRows);
    });
  }

  exportTargetScoresToCsv(
    exportRequest: ExportTargetReportRequest,
    filename: string
  ) {
    const getAssessment = () => exportRequest.assessment;

    this.embargoService.isEmbargoed().subscribe(embargoed => {
      // filter out embargoed results
      if (embargoed && exportRequest.assessment.type === 'sum') {
        return;
      }

      this.csvBuilder
        .newBuilder()
        .withFilename(filename)
        .withGroupName(() => exportRequest.group)
        .withSchoolYear(() => <Exam>{ schoolYear: exportRequest.schoolYear })
        .withAssessmentTypeNameAndSubject(getAssessment)
        .withScoreAndErrorBand(
          () =>
            <Exam>{
              score: exportRequest.averageScaleScore,
              standardError: exportRequest.standardError
            }
        )
        .withTargetReportAggregate(
          exportRequest.subjectDefinition,
          getAssessment,
          item => item
        )
        .build(exportRequest.targetScoreRows);
    });
  }
}
