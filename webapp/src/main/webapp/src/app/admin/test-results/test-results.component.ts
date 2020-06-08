import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { UserService } from '../../shared/security/service/user.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../shared/notification/notification.service';
import { TestResult } from './model/test-result';
import { TestResultsService } from './service/test-results.service';
import { TestResultFilters } from './model/test-result-filters';
import { TestResultsChangeStatusModal } from './test-results-change-status.modal';

class Column {
  id: string; // en.json name
  field: string; // TestResult field
  sortable: boolean;

  constructor({ id, field = '', sortable = true }) {
    this.id = id;
    this.field = field ? field : id;
    this.sortable = sortable;
  }
}

@Component({
  selector: 'test-results',
  templateUrl: './test-results.component.html'
})
export class TestResultsComponent implements OnInit {
  columns: Column[] = [
    new Column({ id: 'school-year', field: 'schoolYear' }),
    new Column({ id: 'district' }),
    new Column({ id: 'subject' }),
    new Column({ id: 'report-type', field: 'reportType' }),
    new Column({ id: 'result-count', field: 'resultCount', sortable: false }),
    new Column({ id: 'status' })
  ];

  changeResultsTooltip: string = 'Change status of selected test results';
  testResultFilters: TestResultFilters;
  filteredTestResults: TestResult[];
  userDistrict: string; // when it's a district admin
  showDistrictFilter: boolean; // set false if districtAdmin
  testResultsState: string;
  private _testResults: TestResult[];

  // TODO Replace with real data
  schoolYearOptions: number[];
  districtOptions: string[];
  subjectOptions: string[];
  statusOptions: string[];
  reportTypeOptions: string[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private userService: UserService,
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private testResultsService: TestResultsService
  ) {}

  get testResults(): TestResult[] {
    return this._testResults;
  }

  set testResults(testResults: TestResult[]) {
    this._testResults = testResults;
    this.updateFilteredTestResults();
  }

  openChangeResultsModal() {
    console.log('testing 1');

    let modalReference: BsModalRef = this.modalService.show(
      TestResultsChangeStatusModal,
      {}
    );
    let modal: TestResultsChangeStatusModal = modalReference.content;
    modal.selectedFilters = this.testResultFilters;
    modal.statusOptions = this.statusOptions;
  }

  ngOnInit() {
    // TODO set from user session
    this.testResultsState = 'California';
    this.showDistrictFilter = !this.testResultsService.isDistrictAdmin();

    // Data for Drop downs
    this.schoolYearOptions = this.testResultsService.getTestResultsSchoolYearOptions();
    this.districtOptions = this.testResultsService.getTestResultsDistrictOptions();
    // TODO  user session determines if Loading is available (only for DevOps)
    this.subjectOptions = this.testResultsService.getTestResultsSubjectOptions();
    this.reportTypeOptions = this.testResultsService.getTestResultsReportTypeOptions();
    this.statusOptions = this.testResultsService.getTestResultsStatusOptions();

    // set defaults - needed since this component is initialized first
    this.testResultsService.setTestResultFilterDefaults();
    this.testResultFilters = this.testResultsService.getTestResultFilterDefaults();
    if (!this.showDistrictFilter) {
      this.userDistrict = 'District 12'; //used when user is DistrictAdmin
      this.testResultFilters.district = this.userDistrict;
    }
    this.testResults = this.testResultsService.getTestResults(
      this.testResultFilters
    );
    this.filteredTestResults = this.testResults;
  }

  // need to save each selected Option to filtered Group
  statusDefault: any = this.testResultsService.statusDefault;
  schoolYearDefault: any = this.testResultsService.schoolYearsDefault;

  // need to save each selected Option to filtered Group
  updateFilteredTestResults() {
    this.filteredTestResults = this.testResultsService.getTestResults(
      this.testResultFilters
    );
  }

  onChangeSchoolYearFilter(schoolYear: any) {
    this.testResultFilters.schoolYear = schoolYear;
    this.updateFilteredTestResults();
  }

  onChangeDistrictFilter(district: any) {
    this.testResultFilters.district = district;
    this.updateFilteredTestResults();
  }

  onChangeSubjectFilter(subject: any) {
    this.testResultFilters.subject = subject;
    this.updateFilteredTestResults();
  }

  onChangeReportTypeFilter(reportType: any) {
    this.testResultFilters.reportType = reportType;
    this.updateFilteredTestResults();
  }

  onChangeStatusFilter(status: any) {
    this.testResultFilters.status = status;
    this.updateFilteredTestResults();
  }

  onDownloadAuditFile() {}
}
