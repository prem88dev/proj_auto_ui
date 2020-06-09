import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-list-all-project',
  templateUrl: './list-all-project.component.html',
  styleUrls: ['./list-all-project.component.css']
})
export class ListAllProjectComponent implements OnInit {

  private projects = [];
  private dataReceived: Boolean = false;
  private currentYear = new Date().getFullYear();
  destroy$: Subject<Boolean> = new Subject<Boolean>();

  constructor(private projectService: ProjectService) { }

  columns = ["Project ID", "Description"];
  index = ["projId", "projDesc"];

  ngOnInit() {
    this.projectService.projectList().pipe(takeUntil(this.destroy$)).subscribe((response: any[]) => {
      this.projects = response;
      this.dataReceived = true;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
