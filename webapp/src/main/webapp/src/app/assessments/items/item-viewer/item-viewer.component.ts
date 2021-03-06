import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AssessmentItem } from '../../model/assessment-item.model';
import { ApplicationSettingsService } from '../../../app-settings.service';

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
   * The item which we want to display the item viewer for.
   */
  @Input()
  public item: AssessmentItem;

  @Input()
  public response: string;

  @Input()
  public position: number;

  @Input()
  public showResponse: boolean = true;

  public irisIsLoading: boolean = true;

  private vendorId;
  private _irisFrame;
  private _currentAttempt = 3;

  @ViewChild('irisframe')
  set irisFrame(value: ElementRef) {
    if (value && value.nativeElement) {
      this._irisFrame = value.nativeElement;
    }
  }

  constructor(private applicationSettingsService: ApplicationSettingsService) {}

  ngOnInit() {
    this.applicationSettingsService.getSettings().subscribe(settings => {
      this.vendorId = settings.irisVendorId;
      this._irisFrame.addEventListener('load', this.irisframeOnLoad.bind(this));
    });
  }

  irisframeOnLoad() {
    IRiS.setFrame(this._irisFrame);
    this.irisIsLoading = false;

    this.loadToken();
  }

  /**
   * Send a request to load the specified assessment item.
   */
  loadToken() {
    let token = this.getToken(this.item.bankItemKey);
    IRiS.loadToken(this.vendorId, token)
      .done(
        function() {
          this.loadResponse();
        }.bind(this)
      )
      .fail(
        function(err) {
          if (this._currentAttempt-- > 0) {
            console.log('Failed to load token, attempting again', err);
            setTimeout(this.loadToken.bind(this), 2000);
          } else {
            console.log('Max failures attempted, aborting.');
          }
        }.bind(this)
      );
  }

  /**
   * Send a request to populate the student's response.
   */
  loadResponse() {
    let response = this.getResponsePayload(this.response, this.position);
    IRiS.setResponses(response);
  }

  private getToken(bankItemKey: string): string {
    return JSON.stringify({
      items: [
        {
          id: `I-${bankItemKey}`
        }
      ]
    });
  }

  private getResponsePayload(response: string, position: number): any {
    let payload: any = {
      position: 1
    };

    if (this.showResponse && response && response.length > 0) {
      payload.response = response;
    }

    if (position && position > 0) {
      payload.label = position.toString();
    }

    return [payload];
  }
}
