import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerComponent } from './divider/divider.component';
import { DividerLinkComponent } from './divider-link/divider-link.component';
import { DividerToggleComponent } from './divider-toggle/divider-toggle.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    DividerComponent,
    DividerLinkComponent,
    DividerToggleComponent
  ],
  exports: [DividerComponent, DividerLinkComponent, DividerToggleComponent]
})
export class ReportingCommonComponentModule {}
