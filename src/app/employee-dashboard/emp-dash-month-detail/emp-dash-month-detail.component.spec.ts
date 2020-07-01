import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpDashMonthDetailComponent } from './emp-dash-month-detail.component';

describe('EmpDashMonthDetailComponent', () => {
  let component: EmpDashMonthDetailComponent;
  let fixture: ComponentFixture<EmpDashMonthDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpDashMonthDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpDashMonthDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
