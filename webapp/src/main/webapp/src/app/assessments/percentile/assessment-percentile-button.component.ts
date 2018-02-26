import { Component, ContentChild, ElementRef, Input, ViewChild } from "@angular/core";
import { PercentileGroup } from "./assessment-percentile";
import { Observable } from "rxjs/Observable";
import { Utils } from "../../shared/support/support";

@Component({
  selector: 'assessment-percentile-button,[assessment-percentile-button]',
  templateUrl: 'assessment-percentile-button.component.html',
  host: {
    'class': 'assessment-percentile-button'
  }
})
export class AssessmentPercentileButton {

  // constructor(private elementReference: ElementRef){
  //   elementReference.nativeElement.getElem
  // }

  @ViewChild('.popover-x') popover: any;
  @ContentChild('.popover-x') popover2: any;

  @Input()
  percentileGroupSource: Observable<PercentileGroup[]>;

  @Input()
  popoverTitle: string = '';

  @Input()
  popoverPlacement: string;

  percentileGroups: PercentileGroup[];

  ngOnInit(): void {
    if (Utils.isNullOrUndefined(this.percentileGroupSource)) {
      throw new Error('AssessmentPercentileButton percentileSource is required');
    }
  }

  onClickInternal(): void {
    if (Utils.isNullOrUndefined(this.percentileGroups)) {
      this.percentileGroupSource.subscribe(percentileGroups => this.percentileGroups = percentileGroups);
    }
  }

  onPopoverShownInternal(): void {
    const element: any = document.querySelector('.popover-x');
    if (element && element.style) {
      const style: CSSStyleDeclaration = element.style;

      Utils.setImmediate(() => style.left = '280px');

    }
    // console.log('popover', element.style.left);
  }

}
