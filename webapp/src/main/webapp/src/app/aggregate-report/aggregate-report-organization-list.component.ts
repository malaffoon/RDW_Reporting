import { Organization } from "../shared/organization/organization";
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: 'aggregate-report-organization-list',
  templateUrl: './aggregate-report-organization-list.component.html'
})
export class AggregateReportOrganizationList {

  @Input()
  organizations: Organization[];

  @Output()
  organizationClick: EventEmitter<Organization> = new EventEmitter<Organization>();

}
