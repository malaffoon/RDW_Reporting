import { Component, Input, OnInit } from "@angular/core";
import { AssessmentItem } from "../../model/assessment-item.model";
import { ItemInfoService } from "./item-info.service";
import { Utils } from "../../../shared/support/support";

@Component({
  selector: 'item-info',
  templateUrl: './item-info.component.html'
})
export class ItemInfoComponent implements OnInit {

  @Input()
  item: AssessmentItem;

  @Input()
  subject: string;

  interpretiveGuideUrl: string;
  targetDescription: string;
  commonCoreStandards: any[];

  constructor(private service: ItemInfoService) {
  }

  ngOnInit() {
    this.service
      .getInterpretiveGuide()
      .subscribe(guide => this.interpretiveGuideUrl = guide);

    if (!Utils.isNullOrUndefined(this.item.targetId)) {
      this.service
        .getTargetDescription(this.item.targetId)
        .subscribe(description => this.targetDescription = description);
    }

    if (this.item.hasCommonCoreStandards) {
      this.service
        .getCommonCoreStandards(this.item.id)
        .subscribe(standards => this.commonCoreStandards = standards);
    }
  }
}
