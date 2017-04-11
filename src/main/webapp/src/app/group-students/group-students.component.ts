import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../shared/data.service";
import {sortAscOn} from "../shared/comparators";
import {Observable} from "rxjs";

@Component({
  selector: 'group-students-component',
  templateUrl: 'group-students.component.html'
})
export class GroupStudentsComponent implements OnInit {

  private breadcrumbs = [];
  private group;
  private students;

  constructor(private service: DataService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.service.getGroup(params['groupId']).subscribe(data => {
        let group = data.group;
        let students = data.students;

        if(group)
          this.breadcrumbs = [{name: group.name}];

        this.group = group;
        this.students = students;
      })
    })
  }

}
