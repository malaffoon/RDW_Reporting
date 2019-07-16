import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantLinkComponent } from './tenant-link.component';

describe('TenantLinkComponent', () => {
  let component: TenantLinkComponent;
  let fixture: ComponentFixture<TenantLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TenantLinkComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
