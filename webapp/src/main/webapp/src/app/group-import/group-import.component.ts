import { Component, OnInit } from "@angular/core";
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

  studentGroupBatches: StudentGroupBatch[] = [];
  public uploader: FileUploader = new FileUploader({ url: URL });

  constructor(private studentGroupService: GroupImportService) {
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      if (!isNullOrUndefined(response)) {
        this.studentGroupBatches.push(this.studentGroupService.mapStudentGroupBatchFromApi(JSON.parse(response)));
        // https://github.com/mariuszfoltak/angular2-datatable/issues/10
        // Landon said to try passing observable
        this.studentGroupBatches = this.studentGroupBatches.slice();
      }
    };
  }

  ngOnInit() {
    this.studentGroupService.findStudentGroupBatches().subscribe(
      x => this.studentGroupBatches = x,
      msg => console.error(`Error: ${msg.status} ${msg.statusText}`)
    );
  }
}
