import { Component, OnInit } from '@angular/core';
import { StudentExamHistoryService } from './student-exam-history.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'student-search',
  templateUrl: './student.component.html'
})
export class StudentComponent implements OnInit {
  formGroup: FormGroup = new FormGroup({
    ssid: new FormControl('', [Validators.required])
  });
  studentNotFound: boolean;

  constructor(
    private service: StudentExamHistoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.formGroup.controls.ssid.valueChanges.subscribe(value => {
      this.studentNotFound = false;
    });
  }

  /**
   * Search for the entered student SSID.  If a student exists with exams,
   * navigate to the results page.  Otherwise, display a not found message.
   */
  onSubmit(): void {
    const { ssid } = this.formGroup.value;
    this.studentNotFound = false;

    // TODO should use async validator
    this.service.existsBySsid(ssid).subscribe(student => {
      if (student != null) {
        this.router.navigateByUrl(`/students/${student.id}`);
      } else {
        this.studentNotFound = true;
      }
    });
  }
}
