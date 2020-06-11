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
  templateUrl: './test-results.component.html',
  styles: [
    '.loadingColor{\n' +
      '  background-color:#d9edf7;\n' +
      '  background-image:none;\n' +
      '}\n' +
      '\n' +
      '.reviewingColor{\n' +
      '  background-color:#fcf8e3;\n' +
      '  background-image:none;\n' +
      '}\n' +
      '\n' +
      '.releasedColor{\n' +
      '  background-color:#dff0d8;\n' +
      '  background-image:none;\n' +
      '}'
  ]
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
  private _testResults: TestResult[];

  changeResultsTooltip: string =
    'Change status of selected test results (all pages).';
  testResultFilters: TestResultFilters;
  filteredTestResults: TestResult[];

  // Used to determine what to display
  userDistrict: string; // when it's a district admin
  showDistrictFilter: boolean; // set false if districtAdmin
  showAudit: boolean; // only DevOps has ability
  state: string; // state of tenant or sandbox logged into
  numOfRows: number = 10; // todo set to be configurable

  // results of change request
  successfulChange: boolean;
  unableToChange: boolean;

  // TODO Replace drop downs with real data
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
    modal.changeStatusEvent.subscribe(res => {
      this.successfulChange = res.data;
      this.unableToChange = res.error;
    });
  }

  ngOnInit() {
    // TODO set from user session
    this.state = 'California';
    this.showDistrictFilter = !this.testResultsService.isDistrictAdmin();
    this.showAudit = this.testResultsService.isDevOps();

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
      this.userDistrict = this.testResultsService.getAdminUserDistrict(); //used when user is DistrictAdmin
      this.testResultFilters.district = this.userDistrict;
    }
    this.testResults = this.testResultsService.getTestResults(
      this.testResultFilters
    );
    this.filteredTestResults = this.testResults;
  }

  // need to save each selected Option to filtered Group
  statusDefault: any = this.testResultsService.statusDefault;

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

  testResultsRowStyleClass(rowData: TestResult) {
    return rowData.status == 'Loading'
      ? 'loadingColor'
      : rowData.status == 'Reviewing'
      ? 'reviewingColor'
      : 'releasedColor';
  }
  onDownloadAuditFile() {}

  closeSuccessAlert() {
    this.successfulChange = false;
  }

  closeErrorAlert() {
    this.unableToChange = false;
  }
}
