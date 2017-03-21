import {Component, OnInit, Input} from "@angular/core";

@Component({
  selector: 'iab-report',
  templateUrl: 'iab-report.component.html'
})
export class IabReportComponent implements OnInit {

  @Input()
  private report;

  constructor() {
  }

  ngOnInit() {

  }

}
