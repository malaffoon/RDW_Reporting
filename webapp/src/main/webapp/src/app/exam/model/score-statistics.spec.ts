import {
  average,
  percent,
  performanceLevelScores,
  roundPercentages,
  scoreStatistics,
  standardErrorOfMean,
  sum
} from './score-statistics';

describe('sum', () => {
  it('should throw error when null', () => {
    expect(() => sum(null)).toThrowError();
  });

  it('should produce zero when given no values', () => {
    expect(sum([])).toBe(0);
  });

  it('should produce the sum of the values passed', () => {
    expect(sum([1, 2, 3])).toBe(6);
  });

  it('should have reasonable number precision', () => {
    expect(sum([1.111, 2.222, 3.333])).toBe(6.666);
  });
});

describe('average', () => {
  it('should throw error when null', () => {
    expect(() => average(null)).toThrowError();
  });

  it('should produce NaN when given no values', () => {
    expect(average([])).toBeNaN();
  });

  it('should produce the average of the values passed', () => {
    expect(average([2, 4, 6, 8, 10])).toBe(6);
  });
});

describe('standardErrorOfMean', () => {
  it('should throw error when null value is present', () => {
    expect(() => standardErrorOfMean([1, null, 2])).toThrowError();
  });

  it('should calculate the average standard error when there no scored exams', () => {
    expect(standardErrorOfMean([])).toBe(0);
  });

  it('should calculate the average standard error of the mean correctly', () => {
    const scores = [2, 4, 6];
    expect(standardErrorOfMean(scores)).toBe(2 / Math.sqrt(scores.length));
  });
});

describe('roundPercentages', () => {
  it('should handle values without remainders', () => {
    expect(roundPercentages([30.0, 70.0])).toEqual([30, 70]);
    expect(roundPercentages([33.0, 34.0, 33.0])).toEqual([33, 34, 33]);
    expect(roundPercentages([20.0, 30.0, 25.0, 25.0])).toEqual([
      20,
      30,
      25,
      25
    ]);
  });

  it('should handle values with remainders', () => {
    expect(roundPercentages([30.5, 69.5])).toEqual([30, 70]);
    expect(roundPercentages([33.49, 32.49, 34.18])).toEqual([34, 32, 34]);
    expect(roundPercentages([40.5, 59.5, 0.0])).toEqual([40, 60, 0]);
    expect(roundPercentages([20.55, 30.2, 25.75, 24.5])).toEqual([
      20,
      30,
      26,
      24
    ]);
  });
});

describe('percent', () => {
  it('should be NaN when denominator is zero', () => {
    expect(percent(1, 0)).toBePositiveInfinity();
  });
  it('should be 100 when both numbers are the same', () => {
    expect(percent(1, 1)).toBe(100);
  });
  it('should accurately compute percent', () => {
    expect(percent(2, 5)).toBe(40);
  });
});

describe('performanceLevelScores', () => {
  it('should zero percents when there are no exams (e.g. denominator is zero)', () => {
    expect(performanceLevelScores([], [2])[0].percent).toBe(0);
  });

  it('should fill levels even when there are no exam scores that fall in the levels', () => {
    expect(performanceLevelScores([], [1])).toEqual([
      {
        level: 1,
        count: 0,
        percent: 0
      }
    ]);
  });

  it('should correctly count levels and percents', () => {
    expect(
      performanceLevelScores([2, 3, 3, 3, 3, 4, 4, 4, 4, 4], [1, 2, 3, 4])
    ).toEqual([
      {
        level: 1,
        count: 0,
        percent: 0
      },
      {
        level: 2,
        count: 1,
        percent: 10
      },
      {
        level: 3,
        count: 4,
        percent: 40
      },
      {
        level: 4,
        count: 5,
        percent: 50
      }
    ]);
  });

  it('should not be responsible for rounding percents', () => {
    const { percent } = performanceLevelScores([1, 1, 2], [1, 2])[0];
    expect(percent).not.toBe(Math.floor(2 / 3));
    expect(percent).not.toBe(Math.ceil(2 / 3));
  });
});

describe('statistics', () => {
  const simpleScoreDefinition = {
    codes: ['code'],
    levels: [1],
    levelCount: 1
  };

  it('should handle no or unscored exams', () => {
    [[], [null], [[]]].forEach(input => {
      expect(scoreStatistics(input, simpleScoreDefinition)).toEqual([
        {
          code: simpleScoreDefinition.codes[0],
          averageScaleScore: NaN,
          standardErrorOfMean: 0,
          performanceLevelScores: [
            {
              level: simpleScoreDefinition.levels[0],
              count: 0,
              percent: 0
            }
          ]
        }
      ]);
    });
  });

  it('should create statistic for each code in score definition', () => {
    const scoreDefinition = {
      codes: ['a', 'b'],
      levels: [1, 2],
      levelCount: 2
    };
    expect(scoreStatistics([], scoreDefinition)).toEqual(
      scoreDefinition.codes.map(code => ({
        code,
        averageScaleScore: NaN,
        standardErrorOfMean: 0,
        performanceLevelScores: scoreDefinition.levels.map(level => ({
          level,
          count: 0,
          percent: 0
        }))
      }))
    );
  });

  it('should correctly create statistics', () => {
    const scoreDefinition = {
      codes: ['a', 'b'],
      levels: [1, 2],
      levelCount: 2
    };
    expect(
      scoreStatistics(
        [
          [
            { level: 1, score: 1, standardError: 3 },
            { level: 1, score: 2, standardError: 3 }
          ],
          [
            { level: 1, score: 3, standardError: 3 },
            { level: 2, score: 4, standardError: 3 }
          ],
          [
            { level: null, score: null, standardError: null },
            { level: null, score: null, standardError: null }
          ],
          [null, null],
          []
        ],
        scoreDefinition
      )
    ).toEqual([
      {
        code: 'a',
        averageScaleScore: average([1, 3]),
        standardErrorOfMean: standardErrorOfMean([1, 3]),
        performanceLevelScores: [
          {
            level: 1,
            count: 2,
            percent: 100
          },
          {
            level: 2,
            count: 0,
            percent: 0
          }
        ]
      },
      {
        code: 'b',
        averageScaleScore: average([2, 4]),
        standardErrorOfMean: standardErrorOfMean([2, 4]),
        performanceLevelScores: [
          {
            level: 1,
            count: 1,
            percent: 50
          },
          {
            level: 2,
            count: 1,
            percent: 50
          }
        ]
      }
    ]);
  });
});
