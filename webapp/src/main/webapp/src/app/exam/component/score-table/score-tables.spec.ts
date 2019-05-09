import { toScoreTable } from './score-tables';
import { Exam } from '../../../assessments/model/exam';
import { SubjectDefinition } from '../../../subject/subject';
import { ScoreTable } from './score-table';

describe('toScoreTable', () => {
  it('should create table for alternate scores', () => {
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
      scoreType: 'Alternate',
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

  it('should create table for overall score', () => {
    const exams = [
      <Exam>{
        level: 1,
        score: 2,
        standardError: 3
      }
    ];

    const subjectDefinition = <SubjectDefinition>{
      subject: 'subject',
      assessmentType: 'assessmentType',
      overallScore: {
        levels: [1],
        levelCount: 1,
        standardCutoff: 1
      }
    };

    const actual = toScoreTable(exams, subjectDefinition, 'Overall');

    const expected: ScoreTable = {
      scoreType: 'Overall',
      subjectCode: subjectDefinition.subject,
      assessmentTypeCode: subjectDefinition.assessmentType,
      resultCount: exams.length,
      scoreStatistics: [
        {
          code: null,
          averageScaleScore: 2,
          standardErrorOfMean: 0,
          performanceLevelScores: [
            {
              level: 1,
              count: 1,
              percent: 100,
              nameCode: 'subject.subject.asmt-type.assessmentType.level.1.name',
              colorCode:
                'subject.subject.asmt-type.assessmentType.level.1.color'
            }
          ]
        }
      ]
    };

    expect(actual).toEqual(expected);
  });
});
