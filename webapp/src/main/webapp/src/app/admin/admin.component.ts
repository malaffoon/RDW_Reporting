import { Component, OnInit } from "@angular/core";
import { AdminService } from "./admin.service";
import { WarehouseImport } from "./warehouse-import.model";

@Component({
  selector: 'admin',
  templateUrl: 'admin.component.html'
})
export class AdminComponent implements OnInit {

  warehouseImports: WarehouseImport[] = [];

  constructor(private adminService: AdminService) {

  }

  ngOnInit() {

    this.adminService.findWarehouseImports().subscribe(
      x => this.warehouseImports = x,
      msg => console.error(`Error: ${msg.status} ${msg.statusText}`)
    );

  }

}
