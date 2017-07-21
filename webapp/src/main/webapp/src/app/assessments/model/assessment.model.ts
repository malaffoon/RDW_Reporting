import { AssessmentType } from "../../shared/enum/assessment-type.enum";

export class Assessment {
  id: number;
  name: string;
  grade: string;
  type: AssessmentType;
  selected: boolean;
  subject: string;
  claimCodes: string[];
  cutPoints: number[];

  get isIab(): boolean {
    return this.type == AssessmentType.IAB;
  }

  get isIca(): boolean {
    return this.type == AssessmentType.ICA;
  }

  get isInterim(): boolean {
    return this.type != AssessmentType.SUMMATIVE;
  }

  get isSummative(): boolean {
    return this.type == AssessmentType.SUMMATIVE;
  }

  /**
   * Determines what level a scale score is in based on the cut points
   *
   * @param score the scale score
   * @param standardError the standard error
   * @returns {number} the level number (starting with 1)
   */
  calculateLevelNumber(score: number, standardError: number): number {
    if (!this.cutPoints || this.cutPoints.length <= 1) {
      return 0;
    }

    if (this.isIab) {
      return this.calculateIabLevel(score, standardError);
    }

    // start with the second element since that is the first cut point and if below that then it is level 1
    for (let i=1; i < this.cutPoints.length; i++) {
      if (score <= this.cutPoints[i]) {
        return i;
      }
    }

    // if we get here, then the score is higher than the max, so return the max level
    //  maximum level is number of cut points in array - 1
    return this.cutPoints.length - 1;
  }

  /**
   * Calculates the level for IABs where it is based on the cut point score and 1.5 * standard error
   *
   * @param score
   * @param standardError
   * @returns {number}
   */
  private calculateIabLevel(score: number, standardError: number) {
    if (!this.cutPoints || this.cutPoints.length < 3) {
      return 0;
    }

    // cutScore is the middle cutPoint (index of 2)
    //  if the score - (1.5 * standardError) > cutScore then level 3
    //  if the score + (1.5 * standardError) < cutScore then level 1
    //  else level 2

    let cutScore = this.cutPoints[2];
    if (score - (1.5 * standardError) > cutScore) {
      return 3;
    }

    if (score + (1.5 * standardError) < cutScore) {
      return 1;
    }

    return 2;
  }
}
