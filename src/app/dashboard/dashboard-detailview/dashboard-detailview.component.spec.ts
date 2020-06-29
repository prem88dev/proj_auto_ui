import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDetailviewComponent } from './dashboard-detailview.component';

describe('DashboardDetailviewComponent', () => {
  let component: DashboardDetailviewComponent;
  let fixture: ComponentFixture<DashboardDetailviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardDetailviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDetailviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
