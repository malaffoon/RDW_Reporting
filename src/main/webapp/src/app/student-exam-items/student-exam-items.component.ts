import {Component, OnInit, ElementRef, ViewChild} from "@angular/core";
import {SafeResourceUrl, DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../shared/data.service";

declare var IRiS : any;

@Component({
  selector: 'student-exam-items',
  templateUrl: './student-exam-items.component.html'
})
export class StudentExamItemsComponent implements OnInit {

  private model : any;
  private selectedRow: any;
  private size = 1;
  private _irisFrame;
  private irisIsLoading = true;

  // TODO:  How is this configured?
  private irisUrl = "https://tds-stage.smarterbalanced.org/iris/";
  private safeIrisUrl : SafeResourceUrl;

  @ViewChild('irisframe')
    set irisFrame(value: ElementRef){
      if(value && value.nativeElement) {
        this._irisFrame = value.nativeElement;
        IRiS.setFrame(value.nativeElement)

        this._irisFrame.addEventListener('load', this.irisframeOnLoad.bind(this));
      }
  }

  constructor(private service: DataService, private route: ActivatedRoute, private sanitizer : DomSanitizer) {
  }

  ngOnInit() {
    this.safeIrisUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.irisUrl);

    this.model = Object.assign({}, this.route.snapshot.data["examData"]);
    this.model.items = this.copyArray(this.model.items);

  }

  irisframeOnLoad(){
    if(this.model.items.length > 0)
      this.selectRow(this.model.items[0]);

    this.irisIsLoading = false;
  }

  selectRow(item){
    this.selectedRow = item;

    IRiS.loadToken(item.irisInfo.vendorId, item.irisInfo.token);

    this.model.answerKey = null;
    this.model.rubrics = null;
    this.model.exemplars = null;

    this.service
      .getItemScoring(item.number)
      .subscribe(
        (data: any) => {
          if(data.answerKey)
            this.model.answerKey = Object.assign({}, data.answerKey);

          this.model.rubrics = this.copyArray(data.rubrics);
          this.model.rubrics.forEach(rubric => rubric.template = this.sanitizer.bypassSecurityTrustHtml(rubric.template))

          this.model.exemplars = this.copyArray(data.exemplars);
          this.model.exemplars.forEach(exemplar => exemplar.template = this.sanitizer.bypassSecurityTrustHtml(exemplar.template))

          this.model.errorLoadingScoringCriteria = false;
        },
        (error: any) => {
          // TODO: log this error.
          this.model.errorLoadingScoringCriteria = true;
        });
  }

  private copyArray(source :any[]){
    let result = [];

    source.forEach(x=> result.push(Object.assign({}, x)))
    return result;
  }

  private toggleWindowSize() {
    this.size++;
    if (this.size > 2) {
      this.size = 0;
    }
    console.log('size', this.size);
  }
}

