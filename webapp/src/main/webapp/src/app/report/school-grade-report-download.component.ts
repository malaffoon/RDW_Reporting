import { Component, Input } from '@angular/core';
import { ReportDownloadComponent } from './report-download.component';
import { NotificationService } from '../shared/notification/notification.service';
import { Grade } from '../school-grade/grade.model';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ApplicationSettingsService } from '../app-settings.service';
import { School } from '../shared/organization/organization';
import { SubjectService } from '../subject/subject.service';
import { UserReportService } from './user-report.service';
import { UserReport } from './report';

/**
 * Component used for single-student exam report download
 */
@Component({
  selector: 'school-grade-report-download,[school-grade-report-download]',
  templateUrl: './report-download.component.html'
})
export class SchoolGradeDownloadComponent extends ReportDownloadComponent {

  @Input()
  school: School;

  @Input()
  grade: Grade;

  constructor(notificationService: NotificationService,
              applicationSettingsService: ApplicationSettingsService,
              subjectService: SubjectService,
              private service: UserReportService,
              private translate: TranslateService) {
    super(notificationService, applicationSettingsService, subjectService);
  }

  createReport(): Observable<UserReport> {
    const { school, grade, options } = this;
    return this.service.createReport({
      type: 'SchoolGrade',
      schoolId: school.id,
      gradeId: grade.id,
      name: options.name,
      assessmentTypeCode: options.assessmentType,
      subjectCode: options.subject,
      schoolYear: options.schoolYear,
      language: options.language,
      accommodationsVisible: options.accommodationsVisible,
      order: options.order,
      disableTransferAccess: options.disableTransferAccess
    });
  }

  generateName(): string {
    const gradeLabel: string = this.translate.instant(`common.assessment-grade-short-label.${this.grade.code}`);
    return `${this.school.name} ${gradeLabel}`;
  }

}
