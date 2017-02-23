import {Component, OnInit} from "@angular/core";
import {DataService} from "../shared/data.service";
import {ActivatedRoute} from "@angular/router";
import {Group} from "../shared/group";

@Component({
  selector: 'group-exams-component',
  templateUrl: 'group-exams.component.html',
  styleUrls: ['group-exams.component.less']
})
export class GroupExamsComponent implements OnInit {

  private group: any;
  private context: any;

  constructor(private service: DataService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.service.getGroupExams(params['groupId'])
          .subscribe((group: any) => {

            let academicYears = new Set();
            let assessmentTypes = new Set();
            group.exams.forEach(exam => {
              academicYears.add(exam.assessment.academicYear);
              assessmentTypes.add(exam.assessment.type);
            });
            group.sortedAcademicYears = Array.from(academicYears).sort();
            group.sortedAssessmentTypes = Array.from(assessmentTypes).sort();

            this.group = group;
            this.context = {
              breadcrumbs: [
                {name: group.name}
              ]
            }
          });
      });
  }

}
