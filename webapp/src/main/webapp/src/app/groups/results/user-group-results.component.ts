import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamFilterOptionsService } from '../../assessments/filters/exam-filters/exam-filter-options.service';
import { GroupAssessmentService } from './group-assessment.service';
import { Angulartics2 } from 'angulartics2';
import { CsvExportService } from '../../csv-export/csv-export.service';
import { Group } from '../group';
import { GroupAssessmentExportService } from './group-assessment-export.service';
import { StateProvider } from './group-assessment.provider';
import { AbstractGroupExamsComponent } from './abstract-group-exams.component';
import { Observable } from 'rxjs/Observable';
import { UserGroupAssessmentProvider } from './user-group-assessment.provider';
import { DefaultAssessmentExporter } from './default-assessment-exporter';
import { TranslateService } from '@ngx-translate/core';
import { UserGroupService } from '../../user-group/user-group.service';

@Component({
  selector: 'user-group-results',
  templateUrl: './group-results.component.html'
})
export class UserGroupResultsComponent extends AbstractGroupExamsComponent implements StateProvider {

  constructor(route: ActivatedRoute,
              router: Router,
              filterOptionService: ExamFilterOptionsService,
              angulartics2: Angulartics2,
              csvExportService: CsvExportService,
              assessmentService: GroupAssessmentService,
              assessmentExportService: GroupAssessmentExportService,
              translateService: TranslateService,
              private groupService: UserGroupService) {
    super(route, router, filterOptionService, angulartics2, csvExportService);

    this.assessmentProvider = new UserGroupAssessmentProvider(assessmentService, this);
    this.assessmentExporter = new DefaultAssessmentExporter(assessmentExportService, request =>
      `${this.group.name}-${request.assessment.label}-${translateService.instant(request.type.toString())}-${new Date().toDateString()}`
    );
  }

  getGroups(): Observable<Group[]> {
    return this.groupService.getGroupsAsGroups();
  }

  get dashboardPath(): string {
    return 'group-dashboard';
  }

}
