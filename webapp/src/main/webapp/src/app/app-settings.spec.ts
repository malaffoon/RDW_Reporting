import { toReportLanguages } from './app-settings';

describe('toReportLanguages', () => {
  it('should always have english', () => {
    expect(toReportLanguages([])).toEqual(['en']);
    expect(toReportLanguages(['ja'])).toEqual(['en', 'ja']);
  });
  it('should always have english first', () => {
    expect(toReportLanguages(['ja', 'en'])).toEqual(['en', 'ja']);
  });
  it('should never have redundant entries', () => {
    expect(toReportLanguages(['en', 'ja', 'ja', 'es', 'es'])).toEqual([
      'en',
      'ja',
      'es'
    ]);
  });
});
