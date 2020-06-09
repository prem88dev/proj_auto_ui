import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-revenue',
  templateUrl: './project-revenue.component.html',
  styleUrls: ['./project-revenue.component.css']
})
export class ProjectRevenueComponent implements OnInit {

  private revenue = [];
  private currentYear = new Date().getFullYear();
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    let revenueYear = this.route.snapshot.paramMap.get('year');
    const esaId = this.route.snapshot.paramMap.get('esaId');
    if (revenueYear === null || revenueYear === "") {
      revenueYear = this.currentYear.toString();
    }

    this.projectService.projectRevenue(esaId, revenueYear).pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      console.log(data);
      this.revenue = data;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
