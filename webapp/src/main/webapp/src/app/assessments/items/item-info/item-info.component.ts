import { Component, Input, OnInit } from "@angular/core";
import { AssessmentItem } from "../../model/assessment-item.model";
import { ItemInfoService } from "./item-info.service";

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

    if (this.item.targetId != null) {
      this.service
        .getTargetDescription(this.item.targetId)
        .subscribe(description => this.targetDescription = description);
    }

    if (this.item.commonCoreStandardIds && this.item.commonCoreStandardIds.length) {
      this.service
        .getCommonCoreStandards(this.item.id)
        .subscribe(standards => this.commonCoreStandards = standards);
    }
  }

}
