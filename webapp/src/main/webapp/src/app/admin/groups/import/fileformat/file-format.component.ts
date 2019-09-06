import { Component } from '@angular/core';
import { FileFormatService } from './file-format.service';
import { saveAs } from 'file-saver';
import { Download } from '../../../../shared/data/download.model';

@Component({
  selector: 'file-format',
  templateUrl: 'file-format.component.html'
})
export class FileFormatComponent {
  constructor(private service: FileFormatService) {}

  public downloadTemplateFile(): void {
    this.service.getTemplateFile().subscribe(
      (download: Download) => {
        saveAs(download.content, download.name);
      },
      (error: Error) => {
        console.error(error);
      }
    );
  }
}
