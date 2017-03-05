import {Component, OnInit} from "@angular/core";
import {DataService} from "../shared/data.service";
import {Group} from "../shared/group";
import {sortAscOn} from "../shared/comparators";
import {Observable} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  private groups: Observable<Array<Group>>;

  constructor(private service: DataService) {}

  ngOnInit() {
    this.service.getGroupSummaries().subscribe(groups => {
      this.groups = Observable.of(groups);
    })
  }

}
