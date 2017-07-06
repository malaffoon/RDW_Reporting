import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

/**
 * IRiS is the vendor client which allows us to integrate with the
 * Iris iframe.  Declarations are in javasvcript files located in the
 * scripts/iris/client.js
 */
declare var IRiS: any;

/**
 * This component renders the IRIS iframe for viewing the original exam item
 * and student's response.
 */
@Component({
  selector: 'item-viewer',
  templateUrl: './item-viewer.component.html'
})
export class ItemViewerComponent implements OnInit {
  /**
   * The bank item key resolvable in Iris.
   */
  @Input()
  public bankItemKey: string;

  public irisIsLoading: boolean = true;
  public safeIrisUrl: SafeResourceUrl;

  // TODO:  How is this configured?
  private irisUrl = "https://tds-stage.smarterbalanced.org/iris/";

  // TODO: This data should come from API.
  private vendorId = "2B3C34BF-064C-462A-93EA-41E9E3EB8333";
  private _irisFrame;

  @ViewChild('irisframe')
  set irisFrame(value: ElementRef) {
    if (value && value.nativeElement) {
      this._irisFrame = value.nativeElement;
    }
  }

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.safeIrisUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.irisUrl);
    this._irisFrame.addEventListener('load', this.irisframeOnLoad.bind(this));
  }

  irisframeOnLoad() {
    IRiS.setFrame(this._irisFrame);

    let token = this.getToken(this.bankItemKey);
    IRiS.loadToken(this.vendorId, token);
    this.irisIsLoading = false;
  }

  getToken(bankItemKey){
    return `{"passage":{"autoLoad":"false"},"items":[{"id":"I-${bankItemKey}"}],"layout":"WAI"}`;
  }
}
