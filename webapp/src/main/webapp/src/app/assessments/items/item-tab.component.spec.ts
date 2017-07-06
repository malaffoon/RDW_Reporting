import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTabComponent } from './item-tab.component';
import { TabsModule } from "ngx-bootstrap";
import { ItemViewerComponent } from "./item-viewer/item-viewer.component";
import { CommonModule } from "../../shared/common.module";

describe('ItemTabComponent', () => {
  let component: ItemTabComponent;
  let fixture: ComponentFixture<ItemTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TabsModule, CommonModule ],
      declarations: [ ItemTabComponent, ItemViewerComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
