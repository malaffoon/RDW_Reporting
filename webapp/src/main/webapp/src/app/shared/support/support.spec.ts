import {
  deepEqualsIgnoringNullAndFalse,
  difference,
  equalDate,
  flatten,
  rightDifference,
  unflatten,
  Utils
} from './support';
import { isObject } from 'lodash';

describe('Utils', () => {
  it('should pass isNullOrUndefined', () => {
    expect(Utils.isNullOrUndefined(null)).toEqual(true);
    expect(Utils.isNullOrUndefined(undefined)).toEqual(true);
    expect(Utils.isNullOrUndefined('')).toEqual(false);
    expect(Utils.isNullOrUndefined('asdf')).toEqual(false);
  });

  it('should pass isUndefined', () => {
    expect(Utils.isUndefined(null)).toEqual(false);
    expect(Utils.isUndefined(undefined)).toEqual(true);
    expect(Utils.isUndefined('asdf')).toEqual(false);
  });

  it('should pass isNullOrEmpty', () => {
    expect(Utils.isNullOrEmpty(null)).toEqual(true);
    expect(Utils.isNullOrEmpty(undefined)).toEqual(true);
    expect(Utils.isNullOrEmpty('')).toEqual(true);
    expect(Utils.isNullOrEmpty('asdf')).toEqual(false);
  });

  it('should create correct filename appendOrIncrementFileNameSuffix', () => {
    expect(Utils.appendOrIncrementFileNameSuffix('an aggregateReport')).toEqual(
      'an aggregateReport (1)'
    );
    expect(
      Utils.appendOrIncrementFileNameSuffix('an aggregateReport (1)')
    ).toEqual('an aggregateReport (2)');
  });
});

describe('deepEqualsIgnoringNullAndFalse', () => {
  it('should ignore null and false properties', () => {
    expect(
      deepEqualsIgnoringNullAndFalse(
        {
          a: undefined,
          b: null,
          c: false,
          d: 0,
          e: ''
        },
        {
          d: 0,
          e: ''
        }
      )
    ).toBe(true);
  });
});

describe('equalDate', () => {
  it('should be true when instances identical', () => {
    const date = new Date();
    expect(equalDate(date, date)).toBe(true);
  });

  it('should be true when the same date', () => {
    const a = new Date(1, 2, 3);
    const b = new Date(1, 2, 3);
    expect(equalDate(a, b)).toBe(true);
  });

  it('should be false when one is null', () => {
    const date = new Date();
    expect(equalDate(date, null)).toBe(false);
    expect(equalDate(null, date)).toBe(false);
  });

  it('should be false when has a different value for any field', () => {
    const date = new Date(1, 2, 3);
    expect(equalDate(date, new Date(1, 2, 100))).toBe(false);
    expect(equalDate(date, new Date(1, 100, 3))).toBe(false);
    expect(equalDate(date, new Date(100, 2, 3))).toBe(false);
  });

  it('should ignore time', () => {
    const a = new Date(1, 2, 3, 4, 5, 6);
    const b = new Date(1, 2, 3, 5, 6, 7);
    expect(equalDate(a, b)).toBe(true);
  });
});

describe('flatten', () => {
  it('should flatten tree structure', () => {
    expect(
      flatten({
        a: {
          b: [
            {
              c: 1,
              d: '3'
            }
          ],
          bb: 2
        }
      })
    ).toEqual({
      'a.b.0.c': 1,
      'a.b.0.d': '3',
      'a.bb': 2
    });
  });

  it('should run "primitive array value joining" customizer ', () => {
    expect(
      flatten(
        {
          a: {
            b: [
              {
                c: 1,
                d: ['3', '4']
              }
            ]
          }
        },
        (result, object, property) => {
          if (
            Array.isArray(object) &&
            object.every(value => !isObject(value))
          ) {
            result[property] = object.join(',');
            return true;
          }
          return false;
        }
      )
    ).toEqual({
      'a.b.0.c': 1,
      'a.b.0.d': '3,4'
    });
  });
});

describe('unflatten', () => {
  it('should unflatten a flattened object', () => {
    expect(
      unflatten({
        'a.b.0.c': 1,
        'a.b.0.d': '3',
        'a.bb': 2
      })
    ).toEqual({
      a: {
        b: [
          {
            c: 1,
            d: '3'
          }
        ],
        bb: 2
      }
    });
  });
  it('should run customizer', () => {
    expect(
      unflatten(
        {
          'a.b.0.c': '1',
          'a.b.0.d': '3,4,5',
          'a.bb': 2
        },
        value => {
          if (typeof value === 'string') {
            if (value.includes(',')) {
              const array = value.split(',');
              if (array.every(element => Object(element) !== element)) {
                return array.map(element =>
                  typeof element === 'string' ? element.trim() : element
                );
              }
            }
          }
          return value;
        }
      )
    ).toEqual({
      a: {
        b: [
          {
            c: '1',
            d: ['3', '4', '5']
          }
        ],
        bb: 2
      }
    });
  });
});

const left = {
  a: 1,
  b: 2,
  c: 3
};

const right = {
  b: 2,
  c: 4,
  d: 5
};

describe('difference', () => {
  it('should produce the difference of two flat objects', () => {
    expect(difference(left, right)).toEqual({
      left: {
        a: 1
      },
      middle: {
        c: {
          left: 3,
          right: 4
        }
      },
      right: {
        d: 5
      }
    });
  });
});

describe('rightDifference', () => {
  it('should only take the right difference', () => {
    expect(rightDifference(left, right)).toEqual({
      c: 4,
      d: 5
    });
  });
});
