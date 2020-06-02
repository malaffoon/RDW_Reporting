import { Injectable, OnInit } from '@angular/core';
import { TestResult } from '../model/test-result';
import { TestResultFilters } from '../model/test-result-filters';
import { MockTestResults } from '../mockTestResults';

@Injectable({
  providedIn: 'root'
})
export class TestResultsService implements OnInit {
  private testResultFilters: TestResultFilters = new TestResultFilters();
  private defaultTestResultFilters = new TestResultFilters();
  private mockTestResults = new MockTestResults();

  private statusDefault: string = '';
  private schoolYearsDefault;
  number = null;
  private allDefault: string = 'All';

  ngOnInit(): void {
    this.setTestResultFilterDefaults();
    this.testResultFilters = this.getTestResultFilterDefaults();
  }

  // receive filter's options
  getTestResults(testResultFilters: TestResultFilters): TestResult[] {
    // todo replace with real data
    let testResults = this.mockTestResults.getMockTestResults();

    // todo apply filters to results.
    console.log(
      'getTestResults: testFilters = ' + JSON.stringify(testResultFilters)
    );
    if (this.validateTestResultsFilterAreDefault(testResultFilters)) {
      console.log(
        'Returning all testResults list ' + JSON.stringify(testResults)
      );
      return testResults;
    }

    // otherwise filter
    let filterList: any = testResults.filter(tr =>
      this.applyTRFilter(tr, testResultFilters)
    );
    console.log('the filtered list = ' + JSON.stringify(filterList));
    // return filterList;
    return filterList;
  }

  // TODO  log changes and no need to persist
  changeTestResults() {
    this.logTestResults(this.testResultFilters);
  }

  // TODO add save of data
  logTestResults(testResultFilters: TestResultFilters) {
    console.log('Change Request Log Info:' + JSON.stringify(testResultFilters));
  }

  setTestResultFilterDefaults() {
    this.defaultTestResultFilters.schoolYear = this.schoolYearsDefault;
    this.defaultTestResultFilters.district = this.allDefault;
    this.defaultTestResultFilters.subject = this.allDefault;
    this.defaultTestResultFilters.state = 'California'; // TODO Get from session
    this.defaultTestResultFilters.reportType = this.allDefault;
    this.defaultTestResultFilters.status = this.statusDefault;
  }

  getTestResultFilterDefaults(): TestResultFilters {
    return this.defaultTestResultFilters;
  }

  // below data for drop down filter options - TODO need to pull from real data
  getTestResultsSchoolYearOptions(): number[] {
    return [2020, 2019, 2018];
  }

  getTestResultsDistrictOptions(): string[] {
    return [
      this.allDefault,
      'District 2',
      'District 4',
      'District 7',
      'District 12',
      'District 13'
    ];
  }

  getTestResultsSubjectOptions(): string[] {
    return [this.allDefault, 'ELA', 'ELPAC', 'Math', 'Science'];
  }
  getTestResultsStatusOptions(): string[] {
    return [this.statusDefault, 'Loading', 'Reviewing', 'Released'];
  }

  getTestResultsReportTypeOptions(): string[] {
    return [this.allDefault, 'Individual', 'Aggregate'];
  }

  private applyTRFilter(
    testResult: TestResult,
    testResultFilters: TestResultFilters
  ) {
    // may need to adjust order
    if (
      testResultFilters.status != this.statusDefault &&
      testResultFilters.status != testResult.status
    )
      return false;
    if (
      testResultFilters.reportType != this.allDefault &&
      testResultFilters.reportType != testResult.reportType
    )
      return false;
    if (
      testResultFilters.subject != this.allDefault &&
      testResultFilters.subject != testResult.subject
    )
      return false;
    if (
      testResultFilters.district != this.allDefault &&
      testResultFilters.district != testResult.district
    )
      return false;
    if (
      testResultFilters.schoolYear != this.schoolYearsDefault &&
      testResultFilters.schoolYear != testResult.schoolYear
    )
      return false;

    return true;
  }

  validateTestResultsFilterAreDefault(testResultFilters: TestResultFilters) {
    if (
      this.statusDefault == testResultFilters.status &&
      this.allDefault == testResultFilters.reportType &&
      this.allDefault == testResultFilters.subject &&
      this.allDefault == testResultFilters.district &&
      this.schoolYearsDefault == testResultFilters.schoolYear
    ) {
      return true;
    }
    return false;
  }
}
