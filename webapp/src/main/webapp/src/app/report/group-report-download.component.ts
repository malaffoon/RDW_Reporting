import { Component, Input } from '@angular/core';
import { ReportDownloadComponent } from './report-download.component';
import { NotificationService } from '../shared/notification/notification.service';
import { Group } from '../groups/group';
import { Observable } from 'rxjs';
import { ApplicationSettingsService } from '../app-settings.service';
import { SubjectService } from '../subject/subject.service';
import { UserReport } from './report';
import { UserReportService } from './user-report.service';

/**
 * Component used for single-student exam report download
 */
@Component({
  selector: 'group-report-download,[group-report-download]',
  templateUrl: './report-download.component.html'
})
export class GroupReportDownloadComponent extends ReportDownloadComponent {

  @Input()
  group: Group;

  constructor(notificationService: NotificationService,
              applicationSettingsService: ApplicationSettingsService,
              subjectService: SubjectService,
              private service: UserReportService) {
    super(notificationService, applicationSettingsService, subjectService);
  }

  createReport(): Observable<UserReport> {
    const { group, options } = this;
    return this.service.createReport({
      type: 'Group',
      groupId: {
        id: group.id,
        type: group.userCreated ? 'Teacher' : 'Admin'
      },
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
    return this.group.name;
  }

}
