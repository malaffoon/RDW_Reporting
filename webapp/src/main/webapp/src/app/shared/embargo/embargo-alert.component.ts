import { Component } from "@angular/core";
import { EmbargoAlert } from "./embargo-alert";
import { Utils } from "../support/support";
import { EmbargoAlertService } from "./embargo-alert.service";

@Component({
  selector: 'embargo-alert',
  templateUrl: 'embargo-alert.component.html'
})
export class EmbargoAlertComponent {

  alert: EmbargoAlert;

  constructor(private alertService: EmbargoAlertService){
  }

  ngOnInit(): void {
    if (Utils.isNullOrUndefined(this.alert)) {
      this.alertService.getAlert().subscribe(alert => this.alert = alert);
    }
  }

}
