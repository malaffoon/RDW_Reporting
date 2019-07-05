import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SpinnerComponent } from './spinner.component';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerModal } from './spinner.modal';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SpinnerComponent, SpinnerModal],
  imports: [CommonModule, RouterModule, TranslateModule],
  exports: [SpinnerComponent, SpinnerModal]
})
export class RdwLoadingModule {}
