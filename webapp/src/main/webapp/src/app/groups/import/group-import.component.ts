import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { GroupImportService } from "./group-import.service";
import { StudentGroupBatch } from "./student-group-batch.model";
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

  studentGroupBatches: StudentGroupBatch[] = [];
  public uploader: FileUploader;
  public hasDropZoneOver: boolean;

  constructor(private studentGroupService: GroupImportService) {
  }

  ngOnInit() {
    this.uploader = new FileUploader({ url: URL });
    this.uploader.setOptions({ autoUpload: true});

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      if (!isNullOrUndefined(response)) {
        this.studentGroupBatches.push(this.studentGroupService.mapStudentGroupBatchFromApi(JSON.parse(response)));
        this.studentGroupBatches = this.studentGroupBatches.slice();
      }
    };
  }

  openFileDialog() {
    this.fileDialog.nativeElement.click();
  }
}
