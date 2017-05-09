import {Component, OnInit} from "@angular/core";
import {DataService} from "../shared/data.service";
import { Ng2TableModule } from "ng2-table/ng2-table";

@Component({
  selector: 'groups',
  templateUrl: 'groups.component.html'
})
export class GroupsComponent implements OnInit {

  private groups = [];
  private columns = [];

  constructor(private service: DataService) {}

  ngOnInit() {
    this.service.getGroups().subscribe(groups => {
      this.groups = groups;
      this.columns = [
        { title: "Name", name: "name", sort: 'asc'  },
        { title: "School", name: "school", sort: '' },
        { title: "Subject", name: "subject", sort: '' }
      ]
    })
  }

  public onChangeTable(config:any, page:any ):any {
    let sortedData = this.changeSort(this.groups);
    this.groups = sortedData;
  }

  public changeSort(data:any):any {
    let columns = this.columns;
    let columnName:string = void 0;
    let sort:string = void 0;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort !== '' && columns[i].sort !== false) {
        columnName = columns[i].name;
        sort = columns[i].sort;
      }
    }

    if (!columnName) {
      return data;
    }

    // simple sorting
    return data.sort((previous:any, current:any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });


  }

}
