import {Component, OnInit} from "@angular/core";
import {GroupService} from "./group.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  group: any = null;

  constructor(private groupService: GroupService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.groupService.getGroup(params['groupId'])
          .subscribe(group => {
              this.group = group;
            },
            error => {
              console.error(error);
            })
      })
  }

}
