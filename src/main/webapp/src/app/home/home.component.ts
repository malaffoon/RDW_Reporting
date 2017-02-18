import {Component, OnInit} from "@angular/core";
import {DataService} from "../shared/data.service";
import {Group} from "../shared/group";
import {sortOn} from "../shared/comparators";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  groups: Array<Group>;

  constructor(private service: DataService) {
  }

  ngOnInit() {
    console.log('home')
    this.service.getGroupSummaries()
      .subscribe(groups => {
          this.groups = sortOn(groups, group => group.name);
        },
        error => {
          console.error(error);
        })
  }

}
