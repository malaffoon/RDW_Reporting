import { TestResultAvailability } from './model/test-result-availability';

export class MockTestResultsAvailability {
  // TODO: replace once real data is available
  mockTestResults: TestResultAvailability[] = this.getMockTestResults();

  getMockTestResults(): TestResultAvailability[] {
    return [
      {
        schoolYear: 2020,
        district: 'District 12',
        subject: 'Math',
        reportType: 'Individual',
        resultCount: 0,
        status: 'Loading'
      },
      {
        schoolYear: 2020,
        district: 'District 12',
        subject: 'Science',
        reportType: 'Aggregate',
        resultCount: 0,
        status: 'Loading'
      },
      {
        schoolYear: 2020,
        district: 'District 4',
        subject: 'Science',
        reportType: 'Aggregate',
        resultCount: 10560,
        status: 'Reviewing'
      },
      {
        schoolYear: 2019,
        district: 'District 5',
        subject: 'ELA',
        reportType: 'Aggregate',
        resultCount: 12834,
        status: 'Reviewing'
      },
      {
        schoolYear: 2019,
        district: 'District 13',
        subject: 'ELA',
        reportType: 'Aggregate',
        resultCount: 44893,
        status: 'Released'
      },
      {
        schoolYear: 2019,
        district: 'District 13',
        subject: 'ELPAC',
        reportType: 'Aggregate',
        resultCount: 6720,
        status: 'Released'
      },
      {
        schoolYear: 2018,
        district: 'District 13',
        subject: 'ELPAC',
        reportType: 'Aggregate',
        resultCount: 9021,
        status: 'Released'
      },
      {
        schoolYear: 2020,
        district: 'District 5',
        subject: 'ELPAC',
        reportType: 'Aggregate',
        resultCount: 23528,
        status: 'Reviewing'
      },
      {
        schoolYear: 2018,
        district: 'District 5',
        subject: 'ELA',
        reportType: 'Individual',
        resultCount: 7032,
        status: 'Released'
      },
      {
        schoolYear: 2018,
        district: 'District 7',
        subject: 'Math',
        reportType: 'Aggregate',
        resultCount: 80214,
        status: 'Released'
      },
      {
        schoolYear: 2019,
        district: 'District 2',
        subject: 'Math',
        reportType: 'Aggregate',
        resultCount: 80214,
        status: 'Released'
      },
      {
        schoolYear: 2020,
        district: 'District 12',
        subject: 'Math',
        reportType: 'Aggregate',
        resultCount: 80214,
        status: 'Released'
      }
    ];
  }

  // TODO: Make sure Filter options are obtained from REAL initial test results availability
  getTestResultsSchoolYearOptions(): number[] {
    return this.mockTestResults
      .map(a => a.schoolYear)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
  }

  getTestResultsDistrictOptions(): string[] {
    return this.mockTestResults
      .map(a => a.district)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
  }

  getTestResultsSubjectOptions(): string[] {
    return this.mockTestResults
      .map(a => a.subject)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
  }

  getTestResultsReportTypeOptions(): string[] {
    return this.mockTestResults
      .map(a => a.reportType)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
  }
}
