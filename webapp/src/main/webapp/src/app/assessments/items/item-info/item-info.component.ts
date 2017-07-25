import { Component, OnInit, Input } from "@angular/core";
import { AssessmentItem } from "../../model/assessment-item.model";
import { UserService } from "../../../user/user.service";
import { CachingDataService } from "../../../shared/cachingData.service";

@Component({
  selector: 'item-info',
  templateUrl: './item-info.component.html'})
export class ItemInfoComponent implements OnInit {

  @Input()
  item: AssessmentItem;

  interpretiveGuide: string;
  targetDescription: string;

  constructor(private userService: UserService, private cachingDataService: CachingDataService) { }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.interpretiveGuide = user.configuration.interpretiveGuide
    });

    this.cachingDataService.get(`/targets/${this.item.targetId}`).subscribe(target => {
      this.targetDescription = target.description;
    })
  }

}
