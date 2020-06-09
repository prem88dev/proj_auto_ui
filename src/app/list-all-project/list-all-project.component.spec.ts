import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllProjectComponent } from './list-all-project.component';

describe('ListAllProjectComponent', () => {
  let component: ListAllProjectComponent;
  let fixture: ComponentFixture<ListAllProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAllProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAllProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
