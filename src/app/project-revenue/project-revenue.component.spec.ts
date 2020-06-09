import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRevenueComponent } from './project-revenue.component';

describe('ProjectRevenueComponent', () => {
  let component: ProjectRevenueComponent;
  let fixture: ComponentFixture<ProjectRevenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectRevenueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
