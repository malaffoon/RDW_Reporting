import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { removeHtml } from '../support/support';

/**
 * @deprecated use {@link InformationIconComponent}
 *
 * This component is responsible for displaying a label with
 * an information popover icon.
 */
@Component({
  selector: 'info-button,[info-button]',
  templateUrl: './information-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InformationButtonComponent {
  @Input()
  content: string;

  @Input()
  icon: string;

  @Input()
  placement: string = 'top';

  _title: string;
  _sanitizedTitle: string;

  @Input()
  set title(value: string) {
    this._title = value;
    this._sanitizedTitle = removeHtml(value);
  }

  /**
   * Stop propagation of the info button click and dispatch a new click event
   * directly on the document to trigger any global "close" click handlers
   * and prevent displaying multiple info popovers.
   * This is necessary to avoid secondary click effects such as sorting a table
   * when clicking the info button.
   *
   * @param {Event} event The information button click event
   */
  propagateClick(event: Event): void {
    event.stopPropagation();

    setTimeout(() => {
      const clickEvent: MouseEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      window.document.dispatchEvent(clickEvent);
    });
  }
}
