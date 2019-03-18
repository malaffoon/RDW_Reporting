import { FormFieldView } from '../../form';
import { Component, Input } from '@angular/core';

/**
 * The printable report form component
 */
@Component({
  selector: 'form-fields',
  templateUrl: './form-fields.component.html',
  styleUrls: ['./form-fields.component.less']
})
export class FormFieldsComponent {
  /**
   * The form fields computed from the query
   */
  @Input()
  fields: FormFieldView[];
}
