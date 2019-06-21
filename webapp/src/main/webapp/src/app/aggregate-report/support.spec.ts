import { computeEffectiveYears } from './support';

describe('computeEffectiveYears', () => {
  it('should compute years backwards based on input grade span', () => {
    expect(computeEffectiveYears(100, ['01', '02', '03'])).toEqual([
      100,
      99,
      98
    ]);
  });

  it('should accommodate any order of grade codes', () => {
    expect(computeEffectiveYears(100, ['03', '02', '01'])).toEqual([
      100,
      99,
      98
    ]);
  });
});
