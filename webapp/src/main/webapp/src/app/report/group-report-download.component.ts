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
  selector: '[group-report-download]',
  templateUrl: './report-download.component.html'
})
export class GroupReportDownloadComponent extends ReportDownloadComponent {

  @Input()
  public groupId: number;

  private subscription: Subscription;

  constructor(private service: ReportService, private notificationService: NotificationService) {
    super('labels.reports.button-label.group');
  }

  public submit(): void {
    this.service.createGroupExamReport(this.groupId, this.options)
      .subscribe(
        (report: Report) => {
          this.notificationService.info({ id: 'labels.reports.messages.submitted', html: true });
        },
        (error: any) => {
          this.notificationService.error({ id: 'labels.reports.messages.submission-failed', html: true });
        }
      );
  }

}
