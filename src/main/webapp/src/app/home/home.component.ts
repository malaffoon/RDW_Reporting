import {Component, OnInit} from "@angular/core";
import {DataService} from "../shared/data.service";
import {Group} from "../shared/group";
import {sortAscOn} from "../shared/comparators";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  private groups: Array<Group>;

  constructor(private service: DataService) {
  }

  ngOnInit() {
    this.service.getGroupSummaries()
      .subscribe(groups => {
          this.groups = sortAscOn(groups, group => group.name);
        },
        error => {
          console.error(error);
        })
  }

}
