import {Component, OnInit} from "@angular/core";
import {GroupService} from "./group.service";

@Component({
  selector: 'app-group',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  groups: Array<any> = null;

  constructor(private groupService: GroupService) {
  }

  ngOnInit() {
    this.groupService.getGroups()
      .subscribe(groups => {
          this.groups = groups;
        },
        error => {
          console.error(error);
        })
  }

}
