import { NgModule } from '@angular/core';
import { WindowRefService } from './window-ref.service';
import { StorageService } from './storage.service';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  providers: [StorageService, WindowRefService]
})
export class RdwCoreModule {}
