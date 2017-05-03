import { Component, OnInit } from '@angular/core';
import {DataService} from "../shared/data.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-student-exam-report',
  templateUrl: './student-exam-report.component.html'
})
export class StudentExamReportComponent implements OnInit {

  private report;

  constructor(private service: DataService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
      .subscribe((params:any) => {
        this.service.getStudentExamReport(params.groupId, params.studentId, params.examId)
          .subscribe(report => {
            this.report = report;

            // compute on backend / standalone service layer
            //   let end = assessment['metadata'].score.maximum;
            //   let start = assessment['metadata'].score.minimum;
            //   let score = assessment['student'].performance.score.value;
            //   let length = end - start;
            //   let model = {
            //     confidence: {
            //       start: start,
            //       end: end,
            //       length: length,
            //       score: score,
            //       scorePosition: ((score - start) / length) * 100,
            //       minimumScorePosition: Math.floor(((assessment['student'].performance.score.range_min - start) / length) * 100),
            //       maximumScorePosition: Math.ceil(((assessment['student'].performance.score.range_max - start) / length) * 100),
            //       segments: assessment['metadata'].score.cutPoints.map((point, index, points) => {
            //         let offset = index == 0 ? 0 : ((points[index - 1] - start) / length);
            //         return {
            //           point: point,
            //           width: (((point - start) / length) - offset) * 100
            //         };
            //       })
            //     }
            //   };
            //   assessment['confidence'] = model.confidence;
            //   this.assessment = assessment;
            })
      })
  }

}
