import { toScoreTable } from './score-tables';
import { Exam } from '../../../assessments/model/exam.model';
import { SubjectDefinition } from '../../../subject/subject';
import { ScoreTable } from './score-table';

describe('toScoreTable', () => {
  it('should create expected model', () => {
    const exams = [
      <Exam>{
        alternateScaleScores: [
          {
            level: 1,
            score: 2,
            standardError: 3
          }
        ]
      }
    ];

    const subjectDefinition = <SubjectDefinition>{
      subject: 'subject',
      assessmentType: 'assessmentType',
      alternateScore: {
        codes: ['a'],
        levels: [1],
        levelCount: 1
      }
    };

    const actual = toScoreTable(exams, subjectDefinition, 'Alternate');

    const expected: ScoreTable = {
      subjectCode: subjectDefinition.subject,
      assessmentTypeCode: subjectDefinition.assessmentType,
      resultCount: exams.length,
      scoreStatistics: [
        {
          code: subjectDefinition.alternateScore.codes[0],
          averageScaleScore: 2,
          standardErrorOfMean: 0,
          performanceLevelScores: [
            {
              level: 1,
              count: 1,
              percent: 100,
              nameCode:
                'subject.subject.asmt-type.assessmentType.alt-score.level.1.name',
              colorCode:
                'subject.subject.asmt-type.assessmentType.alt-score.level.1.color'
            }
          ]
        }
      ]
    };

    expect(actual).toEqual(expected);
  });
});
