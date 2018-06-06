import { Component, Input } from "@angular/core";

@Component({
  selector: 'sb-icon',
  template: `
    <i class="icon sbac"
       [ngClass]="styles"
       [inlineSVG]="svgUrl"></i>
  `
})
export class SBIconComponent {

  @Input()
  icon: string;

  @Input()
  styles: any;

  get svgUrl(): string {
    return `/assets/svgs/${this.icon}.svg`;
  }

}
