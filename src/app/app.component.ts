import { Component, OnInit } from '@angular/core';
import { ProjectService } from './services/project.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private projectList = [];
  private dataReceived: Boolean = false;
  private currentYear = new Date().getFullYear();
  destroy$: Subject<Boolean> = new Subject<Boolean>();

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
    this.projectService.projectList().pipe(takeUntil(this.destroy$)).subscribe((response: any[]) => {
      this.projectList = response;
      this.dataReceived = true;
    });
  }
}