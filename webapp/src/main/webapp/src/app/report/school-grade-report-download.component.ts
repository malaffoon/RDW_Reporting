import { Component, Input } from "@angular/core";
import { ReportService } from "./report.service";
import { saveAs } from "file-saver";
import { Subscription } from "rxjs";
import { ReportDownloadComponent } from "./report-download.component";
import { Download } from "../shared/data/download.model";
import {NotificationService} from "../shared/notification/notification.service";
import {Notification} from "../shared/notification/notification.model";
import { Report } from "./report.model";

/**
 * Component used for single-student exam report download
 */
@Component({
  selector: 'school-grade-report-download',
  templateUrl: './report-download.component.html'
})
export class SchoolGradeDownloadComponent extends ReportDownloadComponent {

  @Input()
  public schoolId: number;

  @Input()
  public gradeId: number;

  private subscription: Subscription;

  constructor(private service: ReportService, private notificationService: NotificationService) {
    super('labels.reports.button-label.school-grade');
  }

  public submit(): void {

    // Keep handle on subscription for disabling submit button
    this.subscription = this.service.createSchoolGradeExamReport(this.schoolId, this.gradeId, this.options)
      .subscribe(
        (report: Report) => {
          this.notificationService.showNotification(new Notification('labels.reports.messages.submitted', { type: 'info' }));
        },
        (error: any) => {
          this.notificationService.showNotification(new Notification('labels.reports.messages.submission-failed', { type: 'danger' }));
          this.subscription = null;
        },
        () => {
          this.subscription = null;
        }
      )
    ;
  }

}
