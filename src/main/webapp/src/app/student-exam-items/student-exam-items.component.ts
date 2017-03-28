import {Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../shared/data.service";
import {TranslateService} from "ng2-translate";

declare var IRiS : any;

@Component({
  selector: 'student-exam-items',
  templateUrl: './student-exam-items.component.html'
})
export class StudentExamItemsComponent implements OnInit{

  private breadcrumbs = [];
  private group: any;
  private student: any;
  private exam: any;
  private items = [];
  private size = 1;
  private _irisFrame;
  private irisIsLoading = true;

  @ViewChild('irisframe')
    set irisFrame(value: ElementRef){
      if(value && value.nativeElement) {
        this._irisFrame = value.nativeElement;
        IRiS.setFrame(value.nativeElement)
      }
  }

  constructor(private service: DataService, private route: ActivatedRoute, private translate: TranslateService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.service.getStudentExam(params['groupId'], params['studentId'], params['examId']).subscribe((data:any) => {
        this.translate.get('labels.assessment.grade').subscribe(breadcrumbName => {
          let group = data.group;
          let student = data.student;
          let exam = data.exam;
          let items = data.items;

          this.breadcrumbs = [
            {name: group.name, path: `/groups/${group.id}/students`},
            {
              name: `${student.lastName}, ${student.firstName}`,
              path: `/groups/${group.id}/students/${student.id}/exams`
            },
            {name: `${breadcrumbName} ${exam.assessment.grade} ${exam.assessment.name}`}
          ];

          if(items.length > 0)
            this.selectRow(items[0]);

          this.group = group;
          this.student = student;
          this.exam = exam;
          this.items = items;
        })
      })
    });
  }

  irisframeOnLoad(){
    if(this.items.length > 0)
      this.selectRow(this.items[0]);

    this.irisIsLoading = false;
  }

  selectRow(item){
    for(var i in this.items){
      this.items[i].selected = this.items[i] === item;
    }

    IRiS.loadToken(item.irisInfo.vendorId, item.irisInfo.token);
  }

  private toggleWindowSize() {
    this.size++;
    if (this.size > 2) {
      this.size = 0;
    }
    console.log('size', this.size);
  }
}

