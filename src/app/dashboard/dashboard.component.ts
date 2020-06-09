import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private dashboard = [];
  private columns = [];
  private index = ["esaId", "revenue"];
  private dataReceived:Boolean = false;
  private currentYear = new Date().getFullYear().toString();
  destroy$: Subject<Boolean> = new Subject<Boolean>();

  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    let yearParam = this.route.snapshot.paramMap.get('year');
    if (yearParam !== null && yearParam !== "") {
      this.currentYear = yearParam;
    }
    this.columns = ["Project ID",
      "Jan-" + this.currentYear,
      "Feb-" + this.currentYear,
      "Mar-" + this.currentYear,
      "Apr-" + this.currentYear,
      "May-" + this.currentYear,
      "Jun-" + this.currentYear,
      "Jul-" + this.currentYear,
      "Aug-" + this.currentYear,
      "Sep-" + this.currentYear,
      "Oct-" + this.currentYear,
      "Nov-" + this.currentYear,
      "Dec-" + this.currentYear,
    ];

    this.dashboardService.dashboard(this.currentYear).pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      console.log(data);
      this.dataReceived = true
      this.dashboard = data;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
