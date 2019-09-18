import { Component, Input } from '@angular/core';

/**
 * Loading spinner that displays on route changes
 */
@Component({
  selector: 'spinner-modal',
  templateUrl: 'spinner.modal.html'
})
export class SpinnerModal {
  @Input()
  loading: boolean = false;
}
