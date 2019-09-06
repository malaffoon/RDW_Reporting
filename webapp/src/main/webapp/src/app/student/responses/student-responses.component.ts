import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssessmentItem } from '../../assessments/model/assessment-item.model';
import { Exam } from '../../assessments/model/exam';
import { Assessment } from '../../assessments/model/assessment';
import { Student } from '../model/student.model';
import { gradeColor } from '../../shared/colors';
import { toStudentResponsesAssessmentItem } from '../../assessments/model/student-responses';
import { StudentResponsesAssessmentItem } from '../../assessments/model/student-responses-item.model';

/**
 * This component is responsible for displaying a student's responses to a
 * particular assessment for a single exam.
 */
@Component({
  selector: 'student-responses',
  templateUrl: './student-responses.component.html'
})
export class StudentResponsesComponent implements OnInit {
  readonly gradeColor = gradeColor;

  assessment: Assessment;
  assessmentItems: StudentResponsesAssessmentItem[];
  exam: Exam;
  student: Student;
  columns: Column[] = [
    new Column({ id: 'number', field: 'assessmentItem.position' }),
    new Column({
      id: 'claim',
      field: 'assessmentItem.claimTarget',
      headerInfo: true
    }),
    new Column({
      id: 'difficulty',
      field: 'assessmentItem.difficulty',
      headerInfo: true
    }),
    new Column({
      id: 'standard',
      field: 'assessmentItem.commonCoreStandardIds'
    }),
    new Column({ id: 'student-points', field: 'score' }),
    new Column({ id: 'max-points', field: 'assessmentItem.maxPoints' }),
    new Column({ id: 'correctness', headerInfo: true })
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const routeItems: AssessmentItem[] = this.route.snapshot.data[
      'assessmentItems'
    ];
    if (routeItems) {
      this.assessmentItems = routeItems.map(item =>
        toStudentResponsesAssessmentItem(item)
      );
    }

    const { exam, assessment, student } = this.route.snapshot.data;
    this.exam = exam;
    this.assessment = assessment;
    this.student = student;
  }
}

class Column {
  id: string;
  field: string;
  headerInfo: boolean;

  constructor({ id, field = '', headerInfo = false }) {
    this.id = id;
    this.field = field ? field : id;
    this.headerInfo = headerInfo;
  }
}
