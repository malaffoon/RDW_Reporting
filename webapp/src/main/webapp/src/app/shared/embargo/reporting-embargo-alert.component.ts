import { Component } from '@angular/core';
import { ReportingEmbargoService } from './reporting-embargo.service';
import { EmbargoAlert } from './embargo-alert.component';

@Component({
  selector: 'reporting-embargo-alert',
  templateUrl: 'embargo-alert.component.html'
})
export class ReportingEmbargoAlert extends EmbargoAlert {
  constructor(service: ReportingEmbargoService) {
    super(service);
  }
}
