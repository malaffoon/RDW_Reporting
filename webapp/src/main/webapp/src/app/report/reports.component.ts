import { OnInit, Component } from "@angular/core";
import { saveAs } from "file-saver";
import { Report } from "./report.model";
import { ActivatedRoute } from "@angular/router";
import { ReportService } from "./report.service";
import { Download } from "../shared/data/download.model";
import { NotificationService } from "../shared/notification/notification.service";
import Timer = NodeJS.Timer;

/**
 * Responsible for controlling the behavior of the reports page
 */
@Component({
  selector: 'reports',
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit {

  public reports: Report[];
  private statusPollingInterval: number = 3000;
  private statusPollingTimer: Timer;

  constructor(private route: ActivatedRoute, private service: ReportService, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.reports = this.route.snapshot.data[ 'reports' ];

    /*
     Start report status polling
     Since reports currently cannot be generated on this page we do not have to dynamically update the IDs to pull
     */
    if (this.reports != null) {
      this.startPollingStatus();
    }
  }

  private startPollingStatus() {
    this.statusPollingTimer = setInterval(() => {

      // get all report IDs for reports that are in progress
      let ids: number[] = this.reports
        .filter(report => report.isProcessing())
        .map(report => report.id);

      // optimally only call API if there are reports that are in progress
      if (ids.length > 0) {

        // optimally only send IDs of reports that are in progress
        this.service.getReportsById(ids).subscribe(
          remoteReports => {

            // flag set when one or more reports are found to have a new status
            let updated: boolean = false;

            // creates a copy of the existing report collection and updates it with reports that have changed
            let updatedReports: Report[] = this.reports.map(local => {
              let remote: Report = remoteReports.find(remote => remote.id === local.id);
              if (remote !== undefined && remote.status !== local.status) {
                updated = true;
                return remote;
              }
              return local;
            });

            // optimally updates the local report collection only when a change is detected
            if (updated) {
              this.reports = updatedReports;
            }

          },
          error => {
            console.error('Error polling report status');
          }
        );
      } else {
        this.stopPollingStatus();
      }

    }, this.statusPollingInterval);
  }

  private stopPollingStatus() {
    clearInterval(this.statusPollingTimer);
  }

  public reload() {
    window.location.reload();
  }

  public getReport(report: Report) {

    this.service.getBatchExamReport(report.id)
      .subscribe(
        (download: Download) => {
          saveAs(download.content, download.name);
        },
        (error: any) => {
          this.notificationService.error({ id: 'labels.reports.messages.download-failed' });
        }
      );
  }

}
