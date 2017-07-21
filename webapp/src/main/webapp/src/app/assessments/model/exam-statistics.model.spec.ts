import { ExamStatistics, ExamStatisticsLevel } from "../model/exam-statistics.model";

describe('Exam Statistics Model', () => {

  it('should calculate level percents', () => {
    let stats = new ExamStatistics();
    stats.total = 10;
    stats.levels = [5, 2, 3].map(x => {
      let level = new ExamStatisticsLevel();
      level.value = x;
      return level;
    });

    let actual = stats.percents;

    expect(actual[ 0 ].value).toBe(50.0);
    expect(actual[ 1 ].value).toBe(20.0);
    expect(actual[ 2 ].value).toBe(30.0);
  });

  it('should calculate level percents when a level does not exist', () => {
    let stats = new ExamStatistics();
    stats.total = 10;
    stats.levels = [6, 0, 4].map(x => {
      let level = new ExamStatisticsLevel();
      level.value = x;
      return level;
    });

    let actual = stats.percents;

    expect(actual[ 0 ].value).toBe(60.0);
    expect(actual[ 1 ].value).toBe(0.0);
    expect(actual[ 2 ].value).toBe(40.0);
  });

});
