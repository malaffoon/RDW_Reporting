import {Component, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {DataService} from "../shared/data/data.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'admin-search',
  templateUrl: './admin-search.component.html'
})
export class AdminSearchComponent implements OnInit {

  private content: any;
  private students;
  private group;
  private searchTerm : string;
  constructor(private translate: TranslateService, private service : DataService, private route : ActivatedRoute, private router : Router) { }

  ngOnInit() {

    this.translate.get('labels.search').subscribe( (searchContent) => {
      this.content = searchContent;
      this.route.queryParams.subscribe( res => {
        this.searchTerm = this.route.snapshot.params['q'];
        if(this.searchTerm) {
          this.search(this.searchTerm);
        }
        else{
          this.students = undefined;
        }
      });
    })
  }

  goToSearchPage(searchTerm : string) {
      this.router.navigate(['/search', { q: searchTerm }]);
      this.search(searchTerm);
  }

  search(searchTerm : string){
    this.service.getStudents({ ssid: searchTerm })
      .subscribe(res => {
        this.students = res.students;
        this.group = res.group;
      });
  }
}
