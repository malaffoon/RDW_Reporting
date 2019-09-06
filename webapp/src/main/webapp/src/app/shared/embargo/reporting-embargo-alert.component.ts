import { Component } from '@angular/core';
import { ReportingEmbargoService } from './reporting-embargo.service';
import { EmbargoAlert } from './embargo-alert.component';
import { UserService } from '../security/service/user.service';

@Component({
  selector: 'reporting-embargo-alert',
  templateUrl: 'embargo-alert.component.html'
})
export class ReportingEmbargoAlert extends EmbargoAlert {
  constructor(service: ReportingEmbargoService, userService: UserService) {
    super(service, userService);
  }
}
