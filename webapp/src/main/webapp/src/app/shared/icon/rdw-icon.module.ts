import { NgModule } from '@angular/core';
import { SBIconComponent } from './sb-icon.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SBIconComponent],
  imports: [CommonModule, InlineSVGModule],
  exports: [SBIconComponent]
})
export class RdwIconModule {}
