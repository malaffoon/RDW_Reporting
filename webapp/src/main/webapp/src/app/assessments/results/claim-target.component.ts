import { Component, Input } from "@angular/core";
import { Observable } from "rxjs";
import { ItemInfoService } from "../items/item-info/item-info.service";
import { AssessmentItem } from "../model/assessment-item.model";

/**
 * This component is responsible for displaying a label with
 * an information popover icon.
 */
@Component({
  selector: 'claim-target',
  templateUrl: './claim-target.component.html'
})
export class ClaimTargetComponent {

  @Input()
  public item: AssessmentItem;

  constructor(private service: ItemInfoService) {
  }

  public getTargetDescription(): Observable<string> {
    return this.service.getTargetDescription(this.item.targetId);
  }

}