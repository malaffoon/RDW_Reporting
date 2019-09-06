import { Component, Input } from '@angular/core';
import { User } from '../../security/state/user';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.less']
})
export class NavigationComponent {
  @Input()
  title: string;

  @Input()
  subtitle: string;

  @Input()
  user: User;

  @Input()
  userGuideUrl: string;

  @Input()
  interpretiveGuideUrl: string;

  @Input()
  optionsHidden: boolean;

  navigationMenuOpen: boolean;

  onNavigationMenuIconClick(): void {
    this.navigationMenuOpen = !this.navigationMenuOpen;
  }
}
