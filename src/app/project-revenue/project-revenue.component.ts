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

  private empObj = [];
  private empBaseDtls = "";
  private empLeave = "";
  private locHoliday = "";
  private empSplWrk = "";
  private locSplWrk = "";
  private buffer = "";
  private revenue = [];
  private sowStart = "";
  private sowStop = "";
  private sowForesee = "";
  private stopWithoutForesee = false;
  private dataReceived: Boolean = false;
  private currentYear = new Date().getFullYear();
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    let revenueYear = this.route.snapshot.paramMap.get('year');
    const esaId = this.route.snapshot.paramMap.get('esaId');
    if (revenueYear === null || revenueYear === "" || revenueYear === undefined) {
      revenueYear = this.currentYear.toString();
    }

    this.projectService.projectRevenue(esaId, revenueYear).pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      console.log(data);
      this.empObj = data[0];
      this.empBaseDtls = this.empObj[0];
      this.empLeave = this.empObj[1].leaves;
      this.locHoliday = this.empObj[2].publicHolidays;
      this.empSplWrk = this.empObj[3].specialWorkDays.empSplWrk;
      this.locSplWrk = this.empObj[3].specialWorkDays.locSplWrk;
      this.buffer = this.empObj[4].buffers;
      this.revenue = this.empObj[5].revenue;

      let sowDate = this.empBaseDtls["sowStart"];
      let splitStr = sowDate.split("-");
      this.sowStart = splitStr[1] + "-" + splitStr[2];

      sowDate = this.empBaseDtls["sowStop"];
      splitStr = sowDate.split("-");
      this.sowStop = splitStr[1] + "-" + splitStr[2];

      sowDate = this.empBaseDtls["foreseenSowStop"];
      if (sowDate.length > 0) {
        splitStr = sowDate.split("-");
        this.sowForesee = splitStr[1] + "-" + splitStr[2];
      }

      if (this.sowStop.length > 0 && this.sowForesee.length === 0) {
        this.stopWithoutForesee = true;
      }

      this.dataReceived = true;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
