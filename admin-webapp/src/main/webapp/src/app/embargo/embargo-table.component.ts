import { Component, Input } from "@angular/core";
import { Embargo } from "./embargo-settings";

@Component({
  selector: 'embargo-table',
  templateUrl: './embargo-table.component.html'
})
export class EmbargoTable {

  @Input()
  embargoes: Embargo[] = [];

  @Input()
  individualDisabled: boolean = false;

  @Input()
  aggregateDisabled: boolean = false;

  @Input()
  organizationNameHeader: string = '';

}
