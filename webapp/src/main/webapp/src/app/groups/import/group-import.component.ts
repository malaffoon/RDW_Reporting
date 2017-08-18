import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { GroupImportService } from "./group-import.service";
import { ImportResult } from "./import-result.model";
import { FileUploader } from "ng2-file-upload";
import { isNullOrUndefined } from "util";

const URL = '/api/studentGroups/';

@Component({
  selector: 'admin',
  templateUrl: 'group-import.component.html'
})
export class GroupImportComponent implements OnInit {

  @ViewChild("fileDialog")
  fileDialog: ElementRef;

  importResults: ImportResult[] = [];
  public uploader: FileUploader;
  public hasDropZoneOver: boolean;

  constructor(private studentGroupService: GroupImportService) {
  }

  ngOnInit() {
    this.uploader = new FileUploader({ url: URL });
    this.uploader.setOptions({ autoUpload: true});

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      if (!isNullOrUndefined(response)) {
        this.importResults.push(this.studentGroupService.mapImportResultFromApi(JSON.parse(response)));
        this.importResults = this.importResults.slice();
      }
    };

    this.uploader.onCompleteAll = () => {
      this.uploader.clearQueue();
    }
  }

  openFileDialog() {
    this.fileDialog.nativeElement.click();
  }
}
