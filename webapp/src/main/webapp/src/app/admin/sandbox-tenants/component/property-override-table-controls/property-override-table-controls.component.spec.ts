import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyOverrideTableControlsComponent } from './property-override-table-controls.component';

describe('PropertyOverrideTableControlsComponent', () => {
  let component: PropertyOverrideTableControlsComponent;
  let fixture: ComponentFixture<PropertyOverrideTableControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PropertyOverrideTableControlsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyOverrideTableControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
