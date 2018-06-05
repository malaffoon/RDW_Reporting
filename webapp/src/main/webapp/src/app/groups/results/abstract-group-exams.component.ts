import { OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentExam } from '../../assessments/model/assessment-exam.model';
import { ExamFilterOptions } from '../../assessments/model/exam-filter-options.model';
import { ExamFilterOptionsService } from '../../assessments/filters/exam-filters/exam-filter-options.service';
import { Angulartics2 } from 'angulartics2';
import { AssessmentsComponent } from '../../assessments/assessments.component';
import { CsvExportService } from '../../csv-export/csv-export.service';
import { GroupReportDownloadComponent } from '../../report/group-report-download.component';
import { Group } from '../group';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { AssessmentProvider } from '../../assessments/assessment-provider.interface';
import { StateProvider } from './group-assessment.provider';
import { Observable } from 'rxjs/Observable';
import { AssessmentExporter } from '../../assessments/assessment-exporter.interface';
import { UserGroupService } from '../../user-group/user-group.service';
import { GroupService } from '../group.service';

export abstract class AbstractGroupExamsComponent implements OnInit, StateProvider {

  @ViewChild(AssessmentsComponent)
  assessmentsComponent: AssessmentsComponent;

  groups: any[];
  assessmentExams: AssessmentExam[] = [];
  filterOptions: ExamFilterOptions = new ExamFilterOptions();
  assessmentProvider: AssessmentProvider;
  assessmentExporter: AssessmentExporter;

  private _group: any;
  private _schoolYear: number;

  get group(): Group {
    return this._group;
  }

  set group(value: Group) {
    this._group = value;
  }

  get schoolYear(): number {
    return this._schoolYear;
  }

  set schoolYear(value: number) {
    this._schoolYear = value;
  }

  get routeParameters(): any {
    return Object.assign({}, this.route.snapshot.params, this.route.snapshot.queryParams);
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private filterOptionService: ExamFilterOptionsService,
              private angulartics2: Angulartics2,
              private csvExportService: CsvExportService,
              private groupService: GroupService,
              private userGroupService: UserGroupService) {
  }

  ngOnInit() {
    forkJoin(
      this.groupService.getGroups(),
      this.userGroupService.getGroupsAsGroups(),
      this.filterOptionService.getExamFilterOptions()
    ).subscribe(([ groups, userGroups, filterOptions ]) => {
      this.groups = groups.concat(userGroups); // TODO sort
      this.filterOptions = filterOptions;
      const { groupId, userGroupId, schoolYear } = this.routeParameters;
      this.group = this.groups.find(group => group.userCreated
        ? group.id == userGroupId
        : group.id == groupId
      );
      this.schoolYear = Number.parseInt(schoolYear) || this.filterOptions.schoolYears[ 0 ];
    });
  }

  viewDashboard() {
    this.router.navigate([ 'group-dashboard', this.group.id, {
      schoolYear: this.schoolYear
    } ]);
  }

  updateAssessment(latestAssessment): void {
    this.assessmentExams = [];
    if (latestAssessment) {
      this.assessmentExams = [ latestAssessment ];
    }
  }

  updateRoute(changeSource: string): void {

    const params = <any>{};
    if (this.group.userCreated) {
      params.userGroupId = this.group.id;
    } else {
      params.groupId = this.group.id;
    }
    params.schoolYear = this.schoolYear;

    this.router.navigate([ params ])
    // this.router.navigate([ 'groups', this.group.id, { schoolYear: this.schoolYear } ])
      .then(() => {
        this.updateAssessment(this.route.snapshot.data[ 'assessment' ]);
      });

    // track change event since wiring select boxes on change as HTML attribute is not possible
    this.angulartics2.eventTrack.next({
      action: 'Change' + changeSource,
      properties: {
        category: 'AssessmentResults',
        label: changeSource === 'Group' ? this.group.id : this.schoolYear
      }
    });
  }

  exportCsv(): void {

    this.angulartics2.eventTrack.next({
      action: 'Export Group Results',
      properties: {
        category: 'Export'
      }
    });

    this.csvExportService.exportAssessmentExams(
      this.assessmentsComponent.assessmentExams,
      this.assessmentsComponent.clientFilterBy,
      this.filterOptions.ethnicities,
      `${this.group.name}-${Date.now().toString()}`
    );
  }

  /**
   * Initializes GroupReportDownloadComponent options with the currently selected filters
   *
   * @param downloader
   */
  initializeDownloader(downloader: GroupReportDownloadComponent): void {
    downloader.options.schoolYear = this.schoolYear;
  }

}
