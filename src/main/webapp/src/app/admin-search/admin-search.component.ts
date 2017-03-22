import { Component, OnInit } from '@angular/core';
import { TranslateService } from "ng2-translate";
import { DataService } from "../shared/data.service";

@Component({
  selector: 'admin-search',
  templateUrl: './admin-search.component.html'
})
export class AdminSearchComponent implements OnInit {

  private content: any;
  private students;
  private group;

  constructor(private translate: TranslateService, private service : DataService) { }

  ngOnInit() {
    this.translate.get('labels.search').subscribe( (searchContent) => {
      this.content = searchContent;
    })
  }

  search(searchTerm : string){
    console.log('searching for ' + searchTerm);
    this.service.getStudents({ ssid: searchTerm })
      .subscribe(res => {
        this.students = res.students;
        this.group = res.group;
      });
  }
}
