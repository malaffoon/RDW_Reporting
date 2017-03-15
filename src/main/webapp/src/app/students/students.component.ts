import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../shared/data.service";
import {sortAscOn} from "../shared/comparators";
import {Observable} from "rxjs";

@Component({
  selector: 'students-component',
  templateUrl: 'students.component.html'
})
export class StudentsComponent implements OnInit {

  private breadcrumbs = [];
  private group;

  constructor(private service: DataService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.service.getGroup(params['groupId']).subscribe(group => {
        this.breadcrumbs = [{name: group.name}];
        this.group = group;
      })
    })
  }

}
