import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import "rxjs/add/operator/switchMap";
import {AssessmentService} from "../shared/assessment.service";

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css']
})
export class AssessmentComponent implements OnInit {

  assessment: any = null;

  constructor(private route: ActivatedRoute, private assessmentService: AssessmentService) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.assessmentService.getAssessment(params['assessmentId'])
          .subscribe(assessment => {
            this.assessment = assessment;
          },
          error => {

          })
      })
  }

}
