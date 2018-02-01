import { Component, OnInit } from "@angular/core";
import { AggregateReportItem } from "../model/aggregate-report-item.model";
import { AssessmentDetailsService } from "./assessment-details.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AggregateReportForm } from "../aggregate-report-form";
import { ReportService } from "../../report/report.service";
import { Report } from "../../report/report.model";

/**
 * This component is responsible for performing the aggregate report query and
 * displaying the results.  Results are displayed in one table per subjectId.
 */
@Component({
  selector: 'aggregate-report',
  templateUrl: './aggregate-report.component.html',
})
export class AggregateReportComponent implements OnInit {

  form: AggregateReportForm;

  reportResource: Report;

  reportItemsBySubjectId: Map<number, AggregateReportItem[]>;

  //TODO @Input
  // public query: AggregateReportQuery;
  // public subjectIds: number[] = [];
  // public performanceGroupingCutpoint: number = -1;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private reportService: ReportService,
              private assessmentDetailsService: AssessmentDetailsService) {

    this.form = this.route.parent.snapshot.data[ 'form' ];
    this.reportResource = this.route.snapshot.data[ 'report' ];

    // this.query = new AggregateReportQuery();
    // this.query.assessmentType = AssessmentType.ICA;

    // // TODO super common code
    // this.options = {
    //   achievementLevelDisplayTypeOptions: [ 'Separate', 'Grouped' ].map(value => <Option>{
    //     value: value,
    //     text: this.translate.instant(`common.achievement-level-display-type.${value}`),
    //     analyticsProperties: { label: `Achievement Level Display Type: ${value}` }
    //   }),
    //   valueDisplayTypeOptions: [ 'Percent', 'Number' ].map(value => <Option>{
    //     value: value,
    //     text: this.translate.instant(`common.value-display-type.${value}`),
    //     analyticsProperties: { label: `Value Display Type: ${value}` }
    //   })
    // };
    // this.settings = {
    //   achievementLevelDisplayType: this.options.achievementLevelDisplayTypeOptions[0].value,
    //   valueDisplayType: this.options.valueDisplayTypeOptions[0].value
    // };
  }

  get loading(): boolean {
    return !this.reportItemsBySubjectId;
  }

  ngOnInit(): void {

    // this.reportService.getReportsById([])

    // Observable.interval(5000)
    //   .switchMap(() => this.reportService.getReportResource(resource.id))
    //   .subscribe(resource => {
    //     if (resource.status === 'complete') {
    //       // TODO remove loading spinner
    //       this.router.navigate(['results', resource.id], {
    //         relativeTo: this.route
    //       });
    //     }
    //   });



    // const detailsObservable: Observable<AssessmentDetails> = this.assessmentDetailsService.getDetails(this.query.assessmentType);
    // const dataObservable: Observable<AggregateReportItem[]> = this.service.getReportData(this.query);
    //
    // Observable.forkJoin(detailsObservable, dataObservable).subscribe((value) => {
    //   const details: AssessmentDetails = value[0];
    //   const items: AggregateReportItem[] = value[1];
    //
    //   this.performanceGroupingCutpoint = details.performanceGroupingCutpoint;
    //
    //   //Break out results by subject to display in separate tables
    //   items.forEach(item => {
    //     if (!this.reportDataBySubjectId.get(item.subjectId)) {
    //       this.reportDataBySubjectId.set(item.subjectId, []);
    //       this.subjectIds.push(item.subjectId);
    //     }
    //     this.reportDataBySubjectId.get(item.subjectId).push(item);
    //   });
    //   this.subjectIds.sort(byNumber);
    //
    //   this.loading = false;
    // });
  }

  onUpdateRequestButtonClick(): void {
    this.router.navigate([ '..' ], { relativeTo: this.route });
  }

}
