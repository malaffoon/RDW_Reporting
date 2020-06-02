import { TestResult } from './model/test-result';

export class MockTestResults {
  // TODO remove once real data is available
  mockTestResults: TestResult[];

  getMockTestResults(): TestResult[] {
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
}
