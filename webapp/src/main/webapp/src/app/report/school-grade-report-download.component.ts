import { Component, Input } from "@angular/core";
import { ReportService } from "./report.service";
import { saveAs } from "file-saver";
import { Subscription } from "rxjs";
import { ReportDownloadComponent } from "./report-download.component";
import { NotificationService } from "../shared/notification/notification.service";
import { Report } from "./report.model";

/**
 * Component used for single-student exam report download
 */
@Component({
  selector: '[school-grade-report-download]',
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
    this.service.createSchoolGradeExamReport(this.schoolId, this.gradeId, this.options)
      .subscribe(
        (report: Report) => {
          this.notificationService.info({ id: 'labels.reports.messages.submitted', html: true });
        },
        (error: any) => {
          this.notificationService.info({ id: 'labels.reports.messages.submission-failed', html: true });
        }
      );
  }

}
