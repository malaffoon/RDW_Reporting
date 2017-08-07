import { Component, Input } from "@angular/core";
import { ReportService } from "./report.service";
import { saveAs } from "file-saver";
import { ReportDownloadComponent } from "./report-download.component";
import { NotificationService } from "../shared/notification/notification.service";
import { Report } from "./report.model";

/**
 * Component used for single-student exam report download
 */
@Component({
  selector: 'school-grade-report-download,[school-grade-report-download]',
  templateUrl: './report-download.component.html'
})
export class SchoolGradeDownloadComponent extends ReportDownloadComponent {

  @Input()
  public schoolId: number;

  @Input()
  public gradeId: number;

  constructor(private service: ReportService, notificationService: NotificationService) {
    super('labels.reports.button-label.school-grade', notificationService);
    this.batch = true;
  }

  public submit(): void {

    this.popover.hide();

    this.service.createSchoolGradeExamReport(this.schoolId, this.gradeId, this.options)
      .subscribe(
        (report: Report) => {
          this.notificationService.info({ id: 'labels.reports.messages.submitted.html', html: true });
        },
        (error: any) => {
          this.notificationService.error({ id: 'labels.reports.messages.submission-failed.html', html: true });
        }
      );
  }

}
