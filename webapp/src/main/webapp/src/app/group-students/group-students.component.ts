import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'group-students-component',
  templateUrl: 'group-students.component.html'
})
export class GroupStudentsComponent implements OnInit {

  private group;
  private students;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    let data = this.route.snapshot.data['groupData'];

    let group = data.group;
    let students = data.students;

    this.group = group;
    this.students = students;
  }
}
