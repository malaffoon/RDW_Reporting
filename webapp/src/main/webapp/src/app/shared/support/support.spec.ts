import {
  deepEqualsIgnoringNullAndFalse,
  flattenJsonObject,
  Utils
} from './support';

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

  it('should flatten JSON object', () => {
    let mockJSON = {
      foo: 'bar',
      state: {
        code: 'CA',
        label: 'California'
      }
    };
    expect(flattenJsonObject(mockJSON)).toEqual({
      foo: 'bar',
      'state.code': 'CA',
      'state.label': 'California'
    });
  });

  it('should flatten JSON object with an array of values', () => {
    let mockJSON = {
      foo: 'bar',
      state: {
        code: 'CA',
        label: 'California'
      },
      languages: ['en', 'es']
    };
    expect(flattenJsonObject(mockJSON)).toEqual({
      foo: 'bar',
      'state.code': 'CA',
      'state.label': 'California',
      languages: 'en,es'
    });
  });

  it('should return empty object for an undefined input', () => {
    expect(flattenJsonObject(undefined)).toEqual({});
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
