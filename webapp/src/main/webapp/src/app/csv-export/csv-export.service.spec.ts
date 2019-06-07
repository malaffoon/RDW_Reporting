import { CsvExportService } from './csv-export.service';
import { ExamFilterService } from '../assessments/filters/exam-filters/exam-filter.service';
import { CsvBuilder } from './csv-builder.service';
import { SubjectService } from '../subject/subject.service';
import { ExamSearchFilterService } from '../exam/service/exam-search-filter.service';
import { ReportingEmbargoService } from '../shared/embargo/reporting-embargo.service';
import { of } from 'rxjs/internal/observable/of';
import { Assessment } from '../assessments/model/assessment';
import { Exam } from '../assessments/model/exam';
import { FilterBy } from '../assessments/model/filter-by.model';
import { AssessmentExam } from '../assessments/model/assessment-exam.model';
import { StudentHistoryExamWrapper } from '../student/model/student-history-exam-wrapper.model';
import { Student } from '../student/model/student.model';
import { ExportItemsRequest } from '../assessments/model/export-items-request.model';
import { ExportWritingTraitsRequest } from '../assessments/model/export-writing-trait-request.model';
import { ExportTargetReportRequest } from '../assessments/model/export-target-report-request.model';

function mockitoStyleSpy<T>(prototype: any): T {
  return jasmine.createSpyObj(
    prototype.constructor.name,
    Object.entries(prototype)
      .filter(([, value]) => typeof value === 'function')
      .map(([key]) => key)
  );
}

function spyOnBuilderMethods<T extends any>(
  prototype: any,
  instance: T,
  builderMethodPrefix: string
): void {
  Object.entries(prototype)
    .filter(
      ([key, value]) =>
        typeof value === 'function' && key.startsWith(builderMethodPrefix)
    )
    .forEach(([key]) => {
      spyOn(instance, key).and.returnValue(instance);
    });
}

describe('CsvExportService', () => {
  let examFilterService: ExamFilterService = new ExamFilterService();
  let csvBuilder: CsvBuilder = new CsvBuilder(null, null, null, null, null);
  let subjectService: SubjectService = new SubjectService(null);
  let examSearchFilterService: ExamSearchFilterService = new ExamSearchFilterService(
    null
  );
  let embargoService: ReportingEmbargoService = new ReportingEmbargoService(
    null,
    null
  );
  let service: CsvExportService = new CsvExportService(
    null,
    null,
    null,
    null,
    null
  );

  const assessmentExams: AssessmentExam[] = [
    {
      assessment: <Assessment>{
        type: 'sum'
      },
      exams: <Exam[]>[{}]
    },
    {
      assessment: <Assessment>{
        type: 'ica'
      },
      exams: <Exam[]>[{}]
    }
  ];

  beforeEach(() => {
    spyOn(subjectService, 'getSubjectCodes').and.returnValue(of(['subjectA']));
    spyOn(subjectService, 'getSubjectDefinitions').and.returnValue(of([]));
    spyOn(examSearchFilterService, 'getExamSearchFilters').and.returnValue(
      of({})
    );

    spyOn(csvBuilder, 'newBuilder').and.returnValue(csvBuilder);
    spyOnBuilderMethods(CsvBuilder.prototype, csvBuilder, 'with');
    spyOn(csvBuilder, 'build');

    service = new CsvExportService(
      examFilterService,
      csvBuilder,
      subjectService,
      examSearchFilterService,
      embargoService
    );
  });

  it('exportAssessmentExams should not out embargoed results when flag is not set', () => {
    spyOn(examFilterService, 'filterExams').and.returnValue([{}]); // equates to not filtering
    spyOn(embargoService, 'isEmbargoed').and.returnValue(of(false));

    service.exportAssessmentExams(assessmentExams, <FilterBy>{}, 'name');

    expect(csvBuilder.build).toHaveBeenCalledWith([
      {
        assessment: <Assessment>{ type: 'sum' },
        exam: <Exam>{}
      },
      {
        assessment: <Assessment>{ type: 'ica' },
        exam: <Exam>{}
      }
    ]);
  });

  it('exportAssessmentExams should filter out embargoed results when flag is set', () => {
    spyOn(examFilterService, 'filterExams').and.returnValue([{}]); // equates to not filtering
    spyOn(embargoService, 'isEmbargoed').and.returnValue(of(true));

    service.exportAssessmentExams(assessmentExams, <FilterBy>{}, 'name');

    expect(csvBuilder.build).toHaveBeenCalledWith([
      {
        assessment: <Assessment>{ type: 'ica' },
        exam: <Exam>{}
      }
    ]);
  });

  it('exportStudentHistory should not filter out embargoed results when flag is not set', () => {
    const history = <StudentHistoryExamWrapper[]>[
      {
        assessment: <Assessment>{ type: 'sum' },
        exam: <Exam>{}
      },
      {
        assessment: <Assessment>{ type: 'ica' },
        exam: <Exam>{}
      }
    ];

    spyOn(embargoService, 'isEmbargoed').and.returnValue(of(false));

    service.exportStudentHistory(history, () => <Student>{}, 'name');

    expect(csvBuilder.build).toHaveBeenCalledWith(history);
  });

  it('exportStudentHistory should filter out embargoed results when flag is set', () => {
    const history = <StudentHistoryExamWrapper[]>[
      {
        assessment: <Assessment>{ type: 'sum' },
        exam: <Exam>{}
      },
      {
        assessment: <Assessment>{ type: 'ica' },
        exam: <Exam>{}
      }
    ];

    spyOn(embargoService, 'isEmbargoed').and.returnValue(of(true));

    service.exportStudentHistory(history, () => <Student>{}, 'name');

    expect(csvBuilder.build).toHaveBeenCalledWith([history[1]]);
  });

  it('exportResultItems should not filter out embargoed results when flag is not set', () => {
    spyOn(embargoService, 'isEmbargoed').and.returnValue(of(false));

    service.exportResultItems(
      <ExportItemsRequest>{
        assessment: <Assessment>{ type: 'sum' },
        assessmentItems: [{ id: 1 }]
      },
      'name'
    );

    expect(csvBuilder.build).toHaveBeenCalledWith([{ id: 1 }]);
  });

  it('exportResultItems should filter out embargoed results when flag is set', () => {
    spyOn(embargoService, 'isEmbargoed').and.returnValue(of(true));

    service.exportResultItems(
      <ExportItemsRequest>{
        assessment: <Assessment>{ type: 'sum' }
      },
      'name'
    );

    expect(csvBuilder.build).not.toHaveBeenCalled();
  });

  it('exportResultItems should not consider embargo for non-summative requests', () => {
    spyOn(embargoService, 'isEmbargoed').and.returnValue(of(true));

    service.exportResultItems(
      <ExportItemsRequest>{
        assessment: <Assessment>{ type: 'ica' },
        assessmentItems: [{ id: 1 }]
      },
      'name'
    );

    expect(csvBuilder.build).toHaveBeenCalledWith([{ id: 1 }]);
  });

  it('exportWritingTraitScores should not filter out embargoed results when flag is not set', () => {
    spyOn(embargoService, 'isEmbargoed').and.returnValue(of(false));

    service.exportWritingTraitScores(
      <ExportWritingTraitsRequest>{
        assessment: <Assessment>{ type: 'sum' },
        assessmentItems: [{ id: 1 }],
        summaries: [
          {
            rows: [
              {
                trait: {
                  maxPoints: 100
                }
              }
            ]
          }
        ]
      },
      'name'
    );

    expect(csvBuilder.build).toHaveBeenCalledWith([
      {
        assessmentItem: { id: 1 },
        writingTraitAggregate: {
          trait: {
            maxPoints: 100
          }
        }
      }
    ]);
  });

  it('exportWritingTraitScores should filter out embargoed results when flag is set', () => {
    spyOn(embargoService, 'isEmbargoed').and.returnValue(of(true));

    service.exportWritingTraitScores(
      <ExportWritingTraitsRequest>{
        assessment: <Assessment>{ type: 'sum' },
        assessmentItems: [{ id: 1 }],
        summaries: [
          {
            rows: [
              {
                trait: {
                  maxPoints: 100
                }
              }
            ]
          }
        ]
      },
      'name'
    );

    expect(csvBuilder.build).not.toHaveBeenCalled();
  });

  it('exportWritingTraitScores should not consider embargo for non-summative requests', () => {
    spyOn(embargoService, 'isEmbargoed').and.returnValue(of(true));

    service.exportWritingTraitScores(
      <ExportWritingTraitsRequest>{
        assessment: <Assessment>{ type: 'ica' },
        assessmentItems: [{ id: 1 }],
        summaries: [
          {
            rows: [
              {
                trait: {
                  maxPoints: 100
                }
              }
            ]
          }
        ]
      },
      'name'
    );

    expect(csvBuilder.build).toHaveBeenCalledWith([
      {
        assessmentItem: { id: 1 },
        writingTraitAggregate: {
          trait: {
            maxPoints: 100
          }
        }
      }
    ]);
  });

  it('exportTargetScoresToCsv should not filter out embargoed results when flag is not set', () => {
    spyOn(embargoService, 'isEmbargoed').and.returnValue(of(false));

    service.exportTargetScoresToCsv(
      <ExportTargetReportRequest>{
        assessment: <Assessment>{ type: 'sum' },
        targetScoreRows: [{}]
      },
      'name'
    );

    expect(csvBuilder.build).toHaveBeenCalledWith([{}]);
  });

  it('exportTargetScoresToCsv should filter out embargoed results when flag is set', () => {
    spyOn(embargoService, 'isEmbargoed').and.returnValue(of(true));

    service.exportTargetScoresToCsv(
      <ExportTargetReportRequest>{
        assessment: <Assessment>{ type: 'sum' },
        targetScoreRows: [{}]
      },
      'name'
    );

    expect(csvBuilder.build).not.toHaveBeenCalled();
  });

  it('exportTargetScoresToCsv should not consider embargo for non-summative requests', () => {
    spyOn(embargoService, 'isEmbargoed').and.returnValue(of(true));

    service.exportTargetScoresToCsv(
      <ExportTargetReportRequest>{
        assessment: <Assessment>{ type: 'ica' },
        targetScoreRows: [{}]
      },
      'name'
    );

    expect(csvBuilder.build).toHaveBeenCalledWith([{}]);
  });
});
