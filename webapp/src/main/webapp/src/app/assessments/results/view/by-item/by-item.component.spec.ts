import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ByItemComponent } from './by-item.component';

describe('ByItemComponent', () => {
  let component: ByItemComponent;
  let fixture: ComponentFixture<ByItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ByItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ByItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
