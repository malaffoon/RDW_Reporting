import {Component, OnInit} from "@angular/core";
import {DataService} from "../shared/data.service";

@Component({
  selector: 'groups',
  templateUrl: 'groups.component.html'
})
export class GroupsComponent implements OnInit {

  private groups = [];

  constructor(private service: DataService) {}

  ngOnInit() {
    this.service.getGroups().subscribe(groups => {
      this.groups = groups;
    })
  }

}
