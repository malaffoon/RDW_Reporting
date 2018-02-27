import { Component, Input } from "@angular/core";
import { Utils } from "../support/support";
import { ReportingEmbargoService } from "./reporting-embargo.service";
import { AggregateEmbargoService } from "./aggregate-embargo.service";


export const ReportingEmbargoAlertSource = 'reporting';
export const AggregateEmbargoAlertSource = 'aggregate';

@Component({
  selector: 'embargo-alert',
  templateUrl: 'embargo-alert.component.html'
})
export class EmbargoAlertComponent {

  private _showAlert: boolean = undefined;
  private _source: string = ReportingEmbargoAlertSource;

  constructor(private reportingEmbargoService: ReportingEmbargoService,
              private aggregateEmbargoService: AggregateEmbargoService){
  }

  get showAlert(): boolean {
    return this._showAlert;
  }

  @Input()
  set source(value: string) {
    this._source = value;
  }

  ngOnInit(): void {
    if (Utils.isNullOrUndefined(this._showAlert)) {
      switch (this._source) {
        case ReportingEmbargoAlertSource:
          this.reportingEmbargoService.isEmbargoed().subscribe(embargoed => this._showAlert = embargoed);
          break;
        case AggregateEmbargoAlertSource:
          this.aggregateEmbargoService.isEmbargoed().subscribe(embargoed => this._showAlert = embargoed);
          break;
      }
    }
  }

}
