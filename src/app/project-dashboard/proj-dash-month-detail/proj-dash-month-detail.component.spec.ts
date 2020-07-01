import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjDashMonthDetailComponent } from './proj-dash-month-detail.component';

describe('ProjDashMonthDetailComponent', () => {
  let component: ProjDashMonthDetailComponent;
  let fixture: ComponentFixture<ProjDashMonthDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjDashMonthDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjDashMonthDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
