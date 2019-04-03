import {
  Component,
  ContentChild,
  ElementRef,
  Input,
  TemplateRef
} from '@angular/core';
import { Utils } from '../support/support';

@Component({
  selector: 'page-heading',
  templateUrl: 'page-heading.component.html',
  host: {
    class: 'page-heading'
  }
})
export class PageHeading {
  @ContentChild('heading')
  heading: TemplateRef<ElementRef>;

  @ContentChild('content')
  content: TemplateRef<ElementRef>;

  ngOnInit(): void {
    if (Utils.isNullOrUndefined(this.heading)) {
      throw new Error('heading template must not be null or undefined');
    }
  }
}
