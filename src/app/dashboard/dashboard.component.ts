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
  private dataReceived: Boolean = false;
  private revenueYear = "";
  private currentYear = new Date().getFullYear();

  destroy$: Subject<Boolean> = new Subject<Boolean>();

  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    let yearParam = this.route.snapshot.paramMap.get('revenueYear');
    if (yearParam !== null && yearParam !== "" && yearParam !== undefined) {
      this.revenueYear = yearParam;
    } else {
      this.revenueYear = this.currentYear.toString();
    }
    this.columns = [
      "Project ID",
      "Jan-" + this.revenueYear,
      "Feb-" + this.revenueYear,
      "Mar-" + this.revenueYear,
      "Apr-" + this.revenueYear,
      "May-" + this.revenueYear,
      "Jun-" + this.revenueYear,
      "Jul-" + this.revenueYear,
      "Aug-" + this.revenueYear,
      "Sep-" + this.revenueYear,
      "Oct-" + this.revenueYear,
      "Nov-" + this.revenueYear,
      "Dec-" + this.revenueYear,
    ];

    this.dashboardService.dashboard(this.revenueYear).pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
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
