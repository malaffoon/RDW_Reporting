import { Injectable } from '@angular/core';
import { AssessmentItem } from '../model/assessment-item.model';
import {
  ExamStatisticsLevel,
  ClaimStatistics
} from '../model/exam-statistics.model';
import { Exam } from '../model/exam';
import { DynamicItemField } from '../model/item-point-field.model';
import { WritingTraitScoreSummary } from '../model/writing-trait-score-summary.model';
import { ExamItemScore } from '../model/exam-item-score.model';
import { WritingTrait } from '../model/writing-trait.model';

@Injectable()
export class ExamStatisticsCalculator {
  private readonly NumberFieldPrefix = 'number-point_';
  private readonly PercentFieldPrefix = 'percent-point_';

  private readonly potentialResponses = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  calculateClaimStatistics(
    exams: Exam[],
    numberOfLevels: number
  ): ClaimStatistics[] {
    let stats = [];

    if (exams == null || exams.length == 0 || exams[0].claimScaleScores == null)
      return stats;

    for (let i = 0; i < exams[0].claimScaleScores.length; i++) {
      let claimStats = <ClaimStatistics>{
        id: i,
        levels: this.groupLevels(
          exams.map(ex => ex.claimScaleScores[i]),
          numberOfLevels
        )
      };

      claimStats.percents = this.mapGroupLevelsToPercents(claimStats.levels);
      stats.push(claimStats);
    }

    return stats;
  }

  getOnlyScoredExams(exams: Exam[]): Exam[] {
    return exams.filter(x => x && x.score);
  }

  groupLevels(exams, numberOfLevels: number): ExamStatisticsLevel[] {
    let levels = [];

    for (let i = 0; i < numberOfLevels; i++) {
      let level = i + 1;
      levels[i] = {
        id: level,
        value: exams.filter(x => x.level == level).length
      };
    }

    return levels;
  }

  mapGroupLevelsToPercents(
    levels: ExamStatisticsLevel[]
  ): ExamStatisticsLevel[] {
    let total = levels.reduce((x, y) => x + y.value, 0);
    return levels.map(x => {
      return {
        id: x.id,
        value: total == 0 ? 0 : (x.value / total) * 100,
        suffix: '%'
      };
    });
  }

  aggregateItemsByPoints(assessmentItems: AssessmentItem[]) {
    for (let item of assessmentItems) {
      const scoreCount: number = item.scores.reduce(
        (count, score) => (score.points >= 0 ? count + 1 : count),
        0
      );
      for (let i = 0; i <= item.maxPoints; i++) {
        if (item.scores.length > 0) {
          let count = item.scores.filter(x => x.points == i).length;
          item[this.NumberFieldPrefix + i] = count;
          item[this.PercentFieldPrefix + i] =
            scoreCount > 0 ? (count / scoreCount) * 100 : 0;
        } else {
          item[this.NumberFieldPrefix + i] = 0;
          item[this.PercentFieldPrefix + i] = 0;
        }
      }
    }
  }

  getPointFields(assessmentItems: AssessmentItem[]): DynamicItemField[] {
    let max = assessmentItems.reduce((x, y) =>
      x.maxPoints > y.maxPoints ? x : y
    ).maxPoints;
    let pointFields: DynamicItemField[] = [];

    for (let i = 0; i <= max; i++) {
      let column: DynamicItemField = new DynamicItemField();
      column.numberField = this.NumberFieldPrefix + i;
      column.percentField = this.PercentFieldPrefix + i;
      column.label = i.toString();
      pointFields.push(column);
    }

    return pointFields;
  }

  aggregateExamWritingTraitScores(
    assessmentItems: AssessmentItem[],
    writingTraits: WritingTrait[],
    purposes: string[]
  ) {
    const summaryMaps = [];
    const randomInt = max => Math.floor(Math.random() * (max + 1));

    assessmentItems.forEach(assessmentItem => {
      const summaryMap = new Map();
      summaryMaps.push(summaryMap);

      const totalTabs = randomInt(5);
      if (totalTabs === 0) {
        return;
      }

      const summaries = [];
      for (let i = 0; i < totalTabs; i++) {
        summaries.push(new WritingTraitScoreSummary(writingTraits));
      }

      // const itemsWithTraitScores = assessmentItem.scores.filter(
      //   x => x.points >= 0 && x.writingTraitScores != null
      // );
      // const totalAnswers = itemsWithTraitScores.length;

      const totalAnswers = 4 + randomInt(5); // reasonable sample range from 4 to 9
      for (let count = 0; count < totalAnswers; count++) {
        for (let tab = 0; tab < totalTabs; tab++) {
          writingTraits.forEach(
            trait =>
              summaries[tab].aggregators.get(trait.type).numbers[
                randomInt(trait.maxPoints)
              ]++
          );
        }
      }

      // itemsWithTraitScores.forEach((score, index) => {
      //   // TODO: this will eventually work with data keyed to subject-specific categories and purposes
      //   // This is the retrieved data for a single purpose
      //   summaries[0].aggregators.get('EVI').numbers[
      //     score.writingTraitScores.evidence
      //   ]++;
      //   summaries[0].aggregators.get('ORG').numbers[
      //     score.writingTraitScores.organization
      //   ]++;
      //   summaries[0].aggregators.get('CON').numbers[
      //     score.writingTraitScores.conventions
      //   ]++;
      //
      //   // Fake up more data.
      //   for (let i = 1; i < totalTabs; i++) {
      //     summaries[i].aggregators.get('EVI').numbers[
      //       score.writingTraitScores.evidence
      //     ] += randomInt(2);
      //     summaries[i].aggregators.get('ORG').numbers[
      //       score.writingTraitScores.organization
      //     ] += randomInt(2);
      //     summaries[i].aggregators.get('CON').numbers[
      //       score.writingTraitScores.conventions
      //     ] += randomInt(2);
      //   }
      // });

      // calculate the averages and the percents based on the raw numbers
      summaries.forEach(summary =>
        summary.rows.forEach((aggregate, points) => {
          let total = 0;
          let count = 0;

          aggregate.numbers.forEach((num, index) => {
            total += num * index;
            count += num;

            aggregate.percents[index] =
              totalAnswers === 0 ? 0 : (num / totalAnswers) * 100;
          });

          aggregate.average = count === 0 ? 0 : total / count;
        })
      );

      for (let i = 0; i < totalTabs; i++) {
        summaryMap.set(purposes[i], summaries[i]);
      }
    });

    return summaryMaps;
  }

  aggregateWritingTraitScores(assessmentItems: AssessmentItem[]) {
    // Used for IAB and ICA assessments.
    const summaryMaps = [];

    assessmentItems.forEach(assessmentItem => {
      const purpose = assessmentItem.performanceTaskWritingType;

      const summary = WritingTraitScoreSummary.InterimScoreSummary();

      const itemsWithTraitScores = assessmentItem.scores.filter(
        x => x.points >= 0 && x.writingTraitScores != null
      );
      const totalAnswers = itemsWithTraitScores.length;

      itemsWithTraitScores.forEach((score, index) => {
        summary.evidence.numbers[score.writingTraitScores.evidence]++;
        summary.organization.numbers[score.writingTraitScores.organization]++;
        summary.conventions.numbers[score.writingTraitScores.conventions]++;
        summary.total.numbers[score.points]++;
      });

      // calculate the averages and the percents based on the raw numbers
      summary.rows.forEach((aggregate, points) => {
        let total = 0;
        let count = 0;

        aggregate.numbers.forEach((num, index) => {
          total += num * index;
          count += num;

          aggregate.percents[index] =
            totalAnswers === 0 ? 0 : (num / totalAnswers) * 100;
        });

        aggregate.average = count === 0 ? 0 : total / count;
      });

      const summaryMap = new Map([[purpose, summary]]);
      summaryMaps.push(summaryMap);
    });

    return summaryMaps;
  }

  aggregateItemsByResponse(assessmentItems: AssessmentItem[]) {
    for (const item of assessmentItems) {
      this.assertNumberOfChoicesIsValid(item.numberOfChoices);

      // Only include "scored" item scores
      const itemScores: ExamItemScore[] = item.scores.filter(
        score => score.points >= 0
      );

      for (let i = 0; i < item.numberOfChoices; i++) {
        const response = this.potentialResponses[i];

        if (itemScores.length > 0) {
          const compareFunction =
            item.type == 'MS'
              ? x => x.response != null && x.response.indexOf(response) !== -1
              : x => x.response == response;

          let count = itemScores.filter(compareFunction).length;

          item[this.NumberFieldPrefix + response] = count;
          item[this.PercentFieldPrefix + response] =
            (count / itemScores.length) * 100;
        } else {
          item[this.NumberFieldPrefix + response] = 0;
          item[this.PercentFieldPrefix + response] = 0;
        }
      }
    }
  }

  getChoiceFields(assessmentItems: AssessmentItem[]): DynamicItemField[] {
    let maxNumberOfChoices = assessmentItems.reduce((x, y) =>
      x.numberOfChoices > y.numberOfChoices ? x : y
    ).numberOfChoices;
    this.assertNumberOfChoicesIsValid(maxNumberOfChoices);

    let pointFields: DynamicItemField[] = [];
    for (let i = 0; i < maxNumberOfChoices; i++) {
      let response = this.potentialResponses[i];

      let column: DynamicItemField = new DynamicItemField();
      column.numberField = this.NumberFieldPrefix + response;
      column.percentField = this.PercentFieldPrefix + response;
      column.label = response;
      pointFields.push(column);
    }

    return pointFields;
  }

  assertNumberOfChoicesIsValid(numberOfChoices: number) {
    // Assert we have a defined potential response for the given number of choices.
    if (numberOfChoices >= this.potentialResponses.length) {
      throw Error('Undefined potential response for given number of choices.');
    }
  }
}
