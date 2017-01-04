import {Component, Optional} from "@angular/core";
import {StandaloneService} from "./standalone/standalone.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title: string = 'Reporting Client';

  constructor(@Optional() standaloneService: StandaloneService){}

}
