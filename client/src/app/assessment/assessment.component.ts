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
            let end = assessment['metadata'].score.range.maximum;
            let start = assessment['metadata'].score.range.minimum;
            let score = assessment['taker'].performance.score.value;
            let length = end - start;
            let model = {
              confidence: {
                start: start,
                end: end,
                length: length,
                score: score,
                scorePosition: ((score - start) / length) * 100,
                minimumScorePosition: Math.floor(((assessment['taker'].performance.score.range.minimum - start) / length) * 100),
                maximumScorePosition: Math.ceil(((assessment['taker'].performance.score.range.maximum - start) / length) * 100),
                segments: assessment['metadata'].score.cut_points.map((point, index, points) => {
                  let offset = index == 0 ? 0 : ((points[index - 1] - start) / length);
                  return {
                    point: point,
                    width: (((point - start) / length) - offset) * 100
                  };
                })
              }
            };

            assessment['confidence'] = model.confidence;

            this.assessment = assessment;
          },
          error => {

          })
      })
  }

}
