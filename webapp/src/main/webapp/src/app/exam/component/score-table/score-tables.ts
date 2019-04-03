import { ScoreDefinition, SubjectDefinition } from '../../../subject/subject';
import {
  statistics,
  ScoreType,
  roundPercentages
} from '../../model/score-statistics';
import { Exam } from '../../../assessments/model/exam.model';
import { ScaleScore } from '../../model/scale-score';
import { ScoreTable } from './score-table';

interface ScoreTypeMetadata {
  scoreDefinition(subjectDefinition: SubjectDefinition): ScoreDefinition;

  scaleScores(exam: Exam): ScaleScore[];

  performanceLevelName(
    level: number,
    subjectCode: string,
    assessmentTypeCode: string
  ): string;

  performanceLevelColor(
    level: number,
    subjectCode: string,
    assessmentTypeCode: string
  ): string;
}

const ScoreTypeMetadataByType: Map<string, ScoreTypeMetadata> = new Map<
  string,
  ScoreTypeMetadata
>([
  [
    'Overall',
    {
      scoreDefinition: ({ overallScore }) => <any>overallScore,
      scaleScores: exam => [exam],
      // TODO fill in when in use
      performanceLevelName: (level, subject, assessmentType) => ``,
      performanceLevelColor: (level, subject, assessmentType) => ``
    }
  ],
  [
    'Alternate',
    {
      scoreDefinition: ({ alternateScore }) => alternateScore,
      scaleScores: ({ alternateScaleScores }) => alternateScaleScores,
      performanceLevelName: (level, subject, assessmentType) =>
        `subject.${subject}.asmt-type.${assessmentType}.alt-score.level.${level}.name`,
      performanceLevelColor: (level, subject, assessmentType) =>
        `subject.${subject}.asmt-type.${assessmentType}.alt-score.level.${level}.color`
    }
  ],
  [
    'Claim',
    {
      scoreDefinition: ({ claimScore }) => claimScore,
      scaleScores: ({ claimScores }) => claimScores,
      performanceLevelName: (level, subject, assessmentType) =>
        `subject.${subject}.asmt-type.${assessmentType}.claim-score.level.${level}.name`,
      performanceLevelColor: (level, subject, assessmentType) =>
        `subject.${subject}.asmt-type.${assessmentType}.claim-score.level.${level}.color`
    }
  ]
]);

export function toScoreTable(
  exams: Exam[],
  subjectDefinition: SubjectDefinition,
  scoreType: ScoreType
): ScoreTable {
  const {
    subject: subjectCode,
    assessmentType: assessmentTypeCode
  } = subjectDefinition;
  const metadata = ScoreTypeMetadataByType.get(scoreType);

  const scoreStatistics = statistics(
    exams.map(exam => metadata.scaleScores(exam)),
    metadata.scoreDefinition(subjectDefinition)
  ).map(value => {
    const roundedPercentages = roundPercentages(
      value.performanceLevelScores.map(({ percent }) => percent)
    );

    return {
      ...value,
      performanceLevelScores: value.performanceLevelScores.map(
        (score, index) => ({
          ...score,
          percent: roundedPercentages[index],
          nameCode: metadata.performanceLevelName(
            score.level,
            subjectCode,
            assessmentTypeCode
          ),
          colorCode: metadata.performanceLevelColor(
            score.level,
            subjectCode,
            assessmentTypeCode
          )
        })
      )
    };
  });

  const resultCount = scoreStatistics.reduce(
    (total, value) => total + value.resultCount,
    0
  );

  return {
    subjectCode,
    assessmentTypeCode,
    resultCount,
    scoreStatistics
  };
}
