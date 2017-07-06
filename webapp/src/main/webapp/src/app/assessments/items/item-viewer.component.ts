import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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
  private _irisFrame;
  private irisIsLoading: boolean = true;

  // TODO:  How is this configured?
  private irisUrl = "https://tds-stage.smarterbalanced.org/iris/";

  // TODO: This data should come from API.
  private vendorId = "2B3C34BF-064C-462A-93EA-41E9E3EB8333";
  private token = '{"passage":{"autoLoad":"false"},"items":[{"response":"<p>test</p>","id":"I-187-2703"}],"layout":"WAI"}';

  private safeIrisUrl: SafeResourceUrl;

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
    IRiS.loadToken(this.vendorId, this.token);
    this.irisIsLoading = false;
  }
}
