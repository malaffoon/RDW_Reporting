import { Component } from "@angular/core";

@Component({
  selector: 'header-component',
  template: `
    <header>
      <div class="container">
        <div class="well">
          <div class="well-body">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {

}
