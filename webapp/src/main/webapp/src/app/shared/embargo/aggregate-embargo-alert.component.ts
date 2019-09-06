import { Component } from '@angular/core';
import { EmbargoAlert } from './embargo-alert.component';
import { AggregateEmbargoService } from './aggregate-embargo.service';
import { UserService } from '../security/service/user.service';

@Component({
  selector: 'aggregate-embargo-alert',
  templateUrl: 'embargo-alert.component.html'
})
export class AggregateEmbargoAlert extends EmbargoAlert {
  constructor(service: AggregateEmbargoService, userService: UserService) {
    super(service, userService);
  }
}
