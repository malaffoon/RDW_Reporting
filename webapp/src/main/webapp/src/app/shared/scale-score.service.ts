import { Injectable } from "@angular/core";
import { Assessment } from "../assessments/model/assessment.model";
import {ExamStatisticsLevel} from "../assessments/model/exam-statistics.model";

@Injectable()
export class ScaleScoreService {


  public calculateScoreDistribution(originalPercents: ExamStatisticsLevel[]): number[] {
    let percents = originalPercents.map(x => x.value);

    let adjustment = percents.filter(x => x < 10).reduce((x, y) => x + 10 - y, 0);
    let total = percents.filter(x => x >= 10).reduce((x, y) => x + y, 0);

    let adjustedPercents = percents.map((x, i) => {
      let a: any = {
        index: i,
        original: x,
        updated: x >= 10 ? x * (total-adjustment) / total : 10
      };

      a.rounded = Math.floor(a.updated);
      a.remainder = a.updated - a.rounded;
      return a;
    });

    let howManyOff100 = 100 - adjustedPercents.reduce((x, y) => x + y.rounded, 0);

    adjustedPercents.sort((a, b) => a.remainder < b.remainder ? 1 : -1);

    // now we have the adjusted breakdown that takes into account anything below 10, needing to take up 10 and readjust the others accordingly
    //  but the percents might not add up to 100 so we need to deal with that
    let increment = howManyOff100 < 0 ? -1 : 1;

    for (let i = 0; i < howManyOff100 * increment; i++) {
      adjustedPercents[i].rounded += increment;
    }

    adjustedPercents.sort((a, b) => a.index < b.index ? -1 : 1);

    return adjustedPercents.map(x => x.original < 10 ? x.original : x.rounded);
  }


  /**
   * Determines what level a scale score is in based on the cut points
   *
   * @param score the scale score
   * @param standardError the standard error
   * @returns {number} the level number (starting with 1)
   */
  public calculateLevelNumber(assessment: Assessment, score: number, standardError: number): number {
    if (!assessment.cutPoints || assessment.cutPoints.length <= 1) {
      return 0;
    }

    if (assessment.isIab) {
      return this.calculateIabLevel(assessment, score, standardError);
    }

    // start with the second element since that is the first cut point and if below that then it is level 1
    for (let i=1; i < assessment.cutPoints.length; i++) {
      if (score <= assessment.cutPoints[i]) {
        return i;
      }
    }

    // if we get here, then the score is higher than the max, so return the max level
    //  maximum level is number of cut points in array - 1
    return assessment.cutPoints.length - 1;
  }

  /**
   * Calculates the level for IABs where it is based on the cut point score and 1.5 * standard error
   *
   * @param score
   * @param standardError
   * @returns {number}
   */
  private calculateIabLevel(assessment: Assessment, score: number, standardError: number) {
    if (!assessment.cutPoints || assessment.cutPoints.length < 3) {
      return 0;
    }

    // cutScore is the middle cutPoint (index of 2)
    //  if the score - (1.5 * standardError) > cutScore then level 3
    //  if the score + (1.5 * standardError) < cutScore then level 1
    //  else level 2

    let cutScore = assessment.cutPoints[2];
    if (score - (1.5 * standardError) > cutScore) {
      return 3;
    }

    if (score + (1.5 * standardError) < cutScore) {
      return 1;
    }

    return 2;
  }
}
