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
  selector: 'group-report-download,[group-report-download]',
  templateUrl: './report-download.component.html'
})
export class GroupReportDownloadComponent extends ReportDownloadComponent {

  @Input()
  public groupId: number;

  constructor(private service: ReportService, notificationService: NotificationService) {
    super('labels.reports.button-label.group', notificationService);
    this.batch = true;
  }

  public submit(): void {
    this.service.createGroupExamReport(this.groupId, this.options)
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
