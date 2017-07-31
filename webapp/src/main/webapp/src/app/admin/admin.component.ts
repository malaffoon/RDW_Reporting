import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { WarehouseImport } from './warehouse-import.model';
import { FileUploader } from 'ng2-file-upload';

const URL = '/api/studentGroups/';

@Component({
  selector: 'admin',
  templateUrl: 'admin.component.html'
})
export class AdminComponent implements OnInit {

  warehouseImports: WarehouseImport[] = [];
  public uploader: FileUploader = new FileUploader({ url: URL });

  constructor(private adminService: AdminService) {

  }

  ngOnInit() {

    this.adminService.findWarehouseImports().subscribe(
      x => this.warehouseImports = x,
      msg => console.error(`Error: ${msg.status} ${msg.statusText}`)
    );

  }

}
