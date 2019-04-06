import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentAssessmentCardComponent } from './student-assessment-card.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '../../shared/common.module';
import { Assessment } from '../../assessments/model/assessment';
import { StudentHistoryExamWrapper } from '../../student/model/student-history-exam-wrapper.model';
import { Exam } from '../../assessments/model/exam';

describe('StudentAssessmentCardComponent', () => {
  let component: StudentAssessmentCardComponent;
  let fixture: ComponentFixture<StudentAssessmentCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [StudentAssessmentCardComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  function createComponent() {
    fixture = TestBed.createComponent(StudentAssessmentCardComponent);
    component = fixture.componentInstance;
  }

  it('should be able to find a match', () => {
    createComponent();
    const latestExam = studentHistoryExamWrapper(
      'iab',
      'find this',
      2,
      new Date(10)
    );
    const exams = [
      studentHistoryExamWrapper('iab', 'something else', 3, new Date(15)),
      studentHistoryExamWrapper('iab', 'find this', 1, new Date(10))
    ];
    component.latestExam = latestExam;
    component.exams = exams;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component._latestExam).toEqual(latestExam);
    expect(component._resultCount).toEqual(1);
  });

  it('should be able to find 2 matches', () => {
    createComponent();
    const latestExam = studentHistoryExamWrapper(
      'iab',
      'find this',
      2,
      new Date(10)
    );
    const exams = [
      studentHistoryExamWrapper('iab', 'find this', 2, new Date(10)),
      studentHistoryExamWrapper('ica', 'something else', 2, new Date(15)),
      studentHistoryExamWrapper('iab', 'find this', 3, new Date(2))
    ];
    component.latestExam = latestExam;
    component.exams = exams;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component._latestExam).toEqual(latestExam);
    expect(component._resultCount).toEqual(2);
  });
});

function assessment(type: string, label: string): Assessment {
  return <Assessment>{
    grade: '03',
    type,
    label
  };
}

function exam(level: number, date: Date): Exam {
  return <Exam>{
    date,
    level
  };
}

function studentHistoryExamWrapper(
  type: string,
  label: string,
  level: number,
  date: Date
): StudentHistoryExamWrapper {
  return {
    assessment: assessment(type, label),
    exam: exam(level, date),
    school: null,
    selected: false
  };
}
