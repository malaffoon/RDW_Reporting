import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'assessment-results',
  templateUrl: './assessment-results.component.html',
})
export class AssessmentResultsComponent implements OnInit {

  @Input()
  assessment;
  
  constructor() { }

  ngOnInit() {
    console.log(this.assessment);
  }


}
