import { toDefaultConfigurations, toServerConfigurations } from './tenants';

describe('toDefaultConfigurations', () => {
  it('should add default school year', () => {
    expect(toDefaultConfigurations({}, 'TENANT')).toEqual({
      'reporting.schoolYear': new Date().getFullYear()
    });
  });
});

describe('toServerConfigurations', () => {
  it('should add school year if absent', () => {
    expect(toServerConfigurations({})).toEqual({
      reporting: {
        schoolYear: new Date().getFullYear()
      }
    });
  });
});
