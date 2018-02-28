import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { User } from "../user/model/user.model";

@Component({
  selector: 'home',
  templateUrl: 'home.component.html',
  host: {
    'class': 'home-view'
  }
})
export class HomeComponent {

  user: User;

  constructor(route: ActivatedRoute) {
    this.user = route.snapshot.data[ 'user' ];
  }

}
