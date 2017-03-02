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

  private context: Observable<any>;

  constructor(private service: DataService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.service.getGroup(params['groupId']).subscribe((group: any) => {
        group.students = sortAscOn(group.students, student => student.lastName, student => student.firstName);
        this.context = Observable.of({
          group: group,
          breadcrumbs: [
            {name: group.name}
          ]
        });
      })
    })
  }

}
