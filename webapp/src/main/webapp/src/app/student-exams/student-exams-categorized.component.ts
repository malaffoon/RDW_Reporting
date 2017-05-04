import {Component, Input, OnInit} from "@angular/core";

@Component({
  selector: 'student-exams-categorized',
  templateUrl: 'student-exams-categorized.component.html'
})
export class StudentExamsCategorizedComponent implements OnInit {

  @Input()
  private category: any;

  @Input()
  private context: any;

  private selectedAcademicYear: any;
  private selectedAssessmentType: any;
  private selectedEnrolledGrade: any;
  private filteredExams: Array<any> = [];

  ngOnInit() {
    this.update();
  }

  onSelectAcademicYear(value: string) {
    this.selectedAcademicYear = value == 'null' ? null : parseInt(value);
    this.update();
  }

  onSelectEnrolledGrade(value: string) {
    this.selectedEnrolledGrade = value == 'null' ? null : parseInt(value);
    this.update();
  }

  onSelectAssessmentType(value: string) {
    this.selectedAssessmentType = value == 'null' ? null : parseInt(value);
    this.update();
  }

  update() {
    this.filteredExams = this.category.exams.filter(exam => {
      return (this.selectedAcademicYear != null ? this.selectedAcademicYear === exam.assessment.academicYear : true)
        && (this.selectedAssessmentType != null ? this.selectedAssessmentType === exam.assessment.type : true)
        && (this.selectedEnrolledGrade != null ? this.selectedEnrolledGrade === exam.grade : true)
        ;
    })
  }

}
