import { Component } from '@angular/core';
import { EmbargoAlert } from './embargo-alert.component';
import { AggregateEmbargoService } from './aggregate-embargo.service';

@Component({
  selector: 'aggregate-embargo-alert',
  templateUrl: 'embargo-alert.component.html'
})
export class AggregateEmbargoAlert extends EmbargoAlert {
  constructor(service: AggregateEmbargoService) {
    super(service);
  }
}
