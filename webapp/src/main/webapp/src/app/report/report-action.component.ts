import { Component, Input, OnInit } from "@angular/core";
import { ReportAction, ReportActionService } from "./report-action.service";
import { PopupMenuAction } from "../shared/menu/popup-menu-action.model";
import { Report } from "./report.model";
import { TranslateService } from "@ngx-translate/core";

/**
 * Responsible for providing a UI displaying and performing an action
 * on a Report.
 */
@Component({
  selector: 'report-action',
  templateUrl: './report-action.component.html'
})
export class ReportActionComponent implements OnInit {

  @Input()
  public report: Report;

  public reportActions: ReportAction[] = [];

  public get menuActions(): PopupMenuAction[] {
    return this.reportActions
      .map(reportAction => this.toMenuAction(reportAction));
  }

  constructor(private actionService: ReportActionService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.reportActions = this.actionService.getActions(this.report);
  }

  performAction(reportAction: ReportAction): void {
    this.actionService.performAction(reportAction);
  }

  private toMenuAction(reportAction: ReportAction): PopupMenuAction {
    const menuAction: PopupMenuAction = new PopupMenuAction();
    menuAction.perform = () => {
      this.actionService.performAction(reportAction);
    };
    menuAction.displayName = () => {
      return this.translateService.instant(reportAction.labelKey);
    };
    return menuAction;
  }
}