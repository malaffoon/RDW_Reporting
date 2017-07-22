import { Assessment } from "../assessments/model/assessment.model";
import { AssessmentType } from "./enum/assessment-type.enum";
import { TestBed, inject } from "@angular/core/testing";
import { ScaleScoreService } from "./scale-score.service";

describe('Assessment Model', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScaleScoreService
      ]
    });
  });

  it('should return level 1 for score below minimum for ICA',
    inject([ScaleScoreService], (service: ScaleScoreService) => {

    let asmt = new Assessment();
    asmt.type = AssessmentType.ICA;
    asmt.cutPoints = [1000, 1100, 1200, 1300, 1400];

    let actual = service.calculateLevelNumber(asmt, 20, 1.0);
    expect(actual).toBe(1);
  }));

  it('should return level 4 for score above maximum for ICA',
    inject([ScaleScoreService], (service: ScaleScoreService) => {

    let asmt = new Assessment();
    asmt.type = AssessmentType.ICA;
    asmt.cutPoints = [1000, 1100, 1200, 1300, 1400];

    let actual = service.calculateLevelNumber(asmt, 9000, 1.0);
    expect(actual).toBe(4);
  }));

  it('should return level 2 for score in range for ICA',
    inject([ScaleScoreService], (service: ScaleScoreService) => {

    let asmt = new Assessment();
    asmt.type = AssessmentType.ICA;
    asmt.cutPoints = [1000, 1100, 1200, 1300, 1400];

    let actual = service.calculateLevelNumber(asmt, 1150, 1.0);
    expect(actual).toBe(2);
  }));

  it('should return level 1 for score far enough below cut point for IAB',
    inject([ScaleScoreService], (service: ScaleScoreService) => {

    let asmt = new Assessment();
    asmt.type = AssessmentType.IAB;
    asmt.cutPoints = [1000, 1100, 1200, 1300, 1400];

    let actual = service.calculateLevelNumber(asmt, 1049, 100.0);
    expect(actual).toBe(1);
  }));

  it('should return level 3 for score far enough above cut point for IAB',
    inject([ScaleScoreService], (service: ScaleScoreService) => {

    let asmt = new Assessment();
    asmt.type = AssessmentType.IAB;
    asmt.cutPoints = [1000, 1100, 1200, 1300, 1400];

    let actual = service.calculateLevelNumber(asmt, 1351, 100);
    expect(actual).toBe(3);
  }));

  it('should return level 2 for score in mid range for IAB',
    inject([ScaleScoreService], (service: ScaleScoreService) => {

    let asmt = new Assessment();
    asmt.type = AssessmentType.IAB;
    asmt.cutPoints = [1000, 1100, 1200, 1300, 1400];

    let actual = service.calculateLevelNumber(asmt, 1150, 100.0);
    expect(actual).toBe(2);
  }));

});
