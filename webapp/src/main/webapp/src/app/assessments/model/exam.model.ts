export class Exam {
  id: number;
  studentName: string;
  date: Date;
  session: string;
  enrolledGrade: number;
  score: number;
  level: number;
  administrativeCondition: string;
  completeness: string;
  standardError: number;
  gender: string;
  migrantStatus: boolean;
  plan504: boolean;
  iep: boolean;
  economicDisadvantage: boolean;
  limitedEnglishProficiency: boolean;
  ethnicities: string[];
  claimLevels: number[];

  get claimLevel0() {
    return this.claimLevels[0];
  }

  get claimLevel1() {
    return this.claimLevels[1];
  }

  get claimLevel2() {
    return this.claimLevels[2];
  }

  get claimLevel3() {
    return this.claimLevels[3];
  }
}
