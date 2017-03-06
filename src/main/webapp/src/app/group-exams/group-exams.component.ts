import {Component, OnInit} from "@angular/core";
import {DataService} from "../shared/data.service";
import {ActivatedRoute} from "@angular/router";
import {TranslateService} from "ng2-translate";

@Component({
  selector: 'group-exams-component',
  templateUrl: 'group-exams.component.html'
})
export class GroupExamsComponent implements OnInit {

  private breadcrumbs = [];
  private group: any = null;
  private academicYearFilterOptions = [];
  private assessmentTypeFilterOptions = [];

  private selectedExams: Set<any> = new Set<any>();
  private selectedAssessment: any;
  private selectedAcademicYear: any;
  private selectedAssessmentType: any;
  private filteredExams: Array<any> = [];
  private count = true;

  private itemsByPointsEarned = [];
  private combinedSelectedAssessments = null;
  private selectedRecords = [];

  constructor(private service: DataService, private route: ActivatedRoute, private translate: TranslateService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.service.getGroupExams(params['groupId']).subscribe((group: any) => {
        this.translate.get('labels.aggregate.link').subscribe(breadcrumbName => {

          this.breadcrumbs = [
            {name: group.name, path: `/groups/${group.id}/students`},
            {name: breadcrumbName}
          ];

          this.group = group;

          this.academicYearFilterOptions = Array.from(group.exams.reduce(
            (values, exam) => values.add(exam.assessment.academicYear), new Set())).sort();

          this.assessmentTypeFilterOptions = Array.from(group.exams.reduce(
            (values, exam) => values.add(exam.assessment.type), new Set())).sort();

          // data prep
          let mockExams = [
            {session: 'ma-01', students: {total: 20, below: .25, near: .5, above: 0.25, averagePerformance: 1, averageScore: 2321}},
            {session: 'ma-02', students: {total: 15, below: .15, near: .1, above: 0.75, averagePerformance: 1, averageScore: 2339}},
            {session: 'ma-03', students: {total: 31, below: .75, near: .1, above: 0.15, averagePerformance: 1, averageScore: 2344}},
            {session: 'ma-04', students: {total: 17, below: .25, near: .5, above: 0.25, averagePerformance: 1, averageScore: 2378}},
            {session: 'ma-05', students: {total: 8, below: .15, near: .25, above: 0.6, averagePerformance: 1, averageScore: 2595}},
            {session: 'ma-06', students: {total: 10, below: .1, near: .4, above: 0.5, averagePerformance: 1, averageScore: 2520}},
            {session: 'ma-07', students: {total: 10, below: .1, near: .4, above: 0.5, averagePerformance: 1, averageScore: 2520}},
            {session: 'ma-08', students: {total: 10, below: .1, near: .4, above: 0.5, averagePerformance: 1, averageScore: 2520}}
          ];

          this.group.exams = this.group.exams.map((exam, index) => Object.assign(exam, mockExams[index]));

          this.itemsByPointsEarned = [
            {name: 'Concepts and Procedures', target: 'Target F', studentsByScore: [3, 9]},
            {name: 'Problem Solving', target: 'Target A', studentsByScore: [6, 3, 3]},
            {name: 'Concepts and Procedures', target: 'Target F', studentsByScore: [3, 9]},
            {name: 'Communicating Reasoning', target: 'Target E', studentsByScore: [7, 5]},
            {name: 'Concepts and Procedures', target: 'Target G', studentsByScore: [3, 6, 3]},
            {name: 'Concepts and Procedures', target: 'Target G', studentsByScore: [3, 9]},
            {name: 'Concepts and Procedures', target: 'Target F', studentsByScore: [3, 9]}
          ].map((item: any, index) => {
            item.number = index + 1;
            item.id = index;
            item.exam = {id: 1};
            item.percentStudentsByScore = item.studentsByScore.map((count, index, counts) => count / counts.reduce((total, count) => total + count), 0);
            return item;
          });

          this.selectedRecords = [
            {student: {lastName: 'Hayden', firstName: 'David'}, grade: 3, performance: 0, score: 2321, date: new Date(2017, 10, 14), session: 'ma-06', attempt: 1, assessment: {type: 0}},
            {student: {lastName: 'Roach', firstName: 'Clementine'}, grade: 4, performance: 0, score: 2339, date: new Date(2017, 10, 14), session: 'ma-06', attempt: 1, assessment: {type: 0}},
            {student: {lastName: 'Valenzuela', firstName: 'Hasad'}, grade: 4, performance: 0, score: 2344, date: new Date(2017, 10, 15), session: 'ma-08', attempt: 2, assessment: {type: 0}},
            {student: {lastName: 'Smith', firstName: 'Joe'}, grade: 4, performance: 0, score: 2378, date: new Date(2017, 10, 15), session: 'ma-08', attempt: 2, assessment: {type: 0}},
            {student: {lastName: 'Cleveland', firstName: 'Joseph'}, grade: 4, performance: 1, score: 2447, date: new Date(2017, 10, 15), session: 'ma-08', attempt: 2, assessment: {type: 0}},
            {student: {lastName: 'Blankenship', firstName: 'Sara'}, grade: 4, performance: 2, score: 2595, date: new Date(2017, 10, 15), session: 'ma-08', attempt: 2, assessment: {type: 0}},
            {student: {lastName: 'Todd', firstName: 'Linus'}, grade: 4, performance: 2, score: 2520, date: new Date(2017, 10, 15), session: 'ma-08', attempt: 2, assessment: {type: 0}}
          ];

          this.filter();
        });

      });
    });
  }

  onExamClick(event, exam) {
    event.stopImmediatePropagation();
    this.toggleExam(!exam.checked, exam);
  }

  toggleExam(checked: boolean, exam: any) {
    if (exam.disabled) {
      return;
    }
    exam.checked = checked;
    if (checked) {
      if (this.selectedExams.size == 0) {
        this.selectedAssessment = exam.assessment;

      }
      this.selectedExams.add(exam);
    } else {
      if (this.selectedExams.size == 1) {
        this.selectedAssessment = null;

      }
      this.selectedExams.delete(exam);
    }
    this.group.exams.forEach(exam => exam.disabled = this.selectedAssessment != null && exam.assessment.id !== this.selectedAssessment.id);
    this.aggregate();
  }

  onAcademicYearChange(value: string) {
    this.selectedAcademicYear = value == 'null' ? null : parseInt(value);
    this.filter();
  }

  onAssessmentTypeChange(value: string) {
    this.selectedAssessmentType = value == 'null' ? null : parseInt(value);
    this.filter();
  }

  filter() {
    this.filteredExams = this.group.exams.filter(exam => {
      return (this.selectedAcademicYear != null ? this.selectedAcademicYear == exam.assessment.academicYear : true)
        && (this.selectedAssessmentType != null ? this.selectedAssessmentType == exam.assessment.type : true);
    });
    this.aggregate();
  }

  aggregate() {

    // ignore selected exams that are filtered out
    let exams = Array.from(this.selectedExams)
      .filter(exam => this.filteredExams.indexOf(exam) != -1);

    if (exams.length == 0) {
      this.combinedSelectedAssessments = null;
    } else {

      let segments = [{label:'Below', value: 0}, {label: 'Near', value: 0}, {label: 'Above', value:0}];

      exams.forEach(exam => {
        segments[0].value += exam.students.below;
        segments[1].value += exam.students.near;
        segments[2].value += exam.students.above;
      });

      segments.forEach((segment:any) => {
        segment.value = Math.floor((segment.value * 100) / exams.length);
      });

      this.combinedSelectedAssessments = {
        totalStudents: exams.reduce((value, exam) => value + exam.students.total, 0),
        averageScaleScore: Math.floor(exams.reduce((value, exam) => value + exam.students.averageScore, 0) / exams.length),
        segments: segments
      };
    }
  }

}
