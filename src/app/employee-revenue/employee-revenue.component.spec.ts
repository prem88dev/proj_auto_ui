import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRevenueComponent } from './employee-revenue.component';

describe('EmployeeRevenueComponent', () => {
  let component: EmployeeRevenueComponent;
  let fixture: ComponentFixture<EmployeeRevenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeRevenueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
