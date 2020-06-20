import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material';

@Component({
  selector: 'app-project-revenue',
  templateUrl: './employee-revenue.component.html',
  styleUrls: ['./employee-revenue.component.css']
})
export class EmployeeRevenueComponent implements OnInit {

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  private empList = [];
  private empObj = [];
  private empBaseDtl = "";
  private empLeave = "";
  private locHoliday = "";
  private empSplWrk = "";
  private locSplWrk = "";
  private buffer = "";
  private revenue = [];
  private sowStart = "";
  private sowStop = "";
  private sowForesee = "";
  private totalRevenue = 0;
  private totalCmiRevenue = 0;
  private dataReceived: Boolean = false;
  private currentYear = new Date().getFullYear();
  private esaId = "";
  private revenueYear = "";

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.esaId = this.route.snapshot.paramMap.get('esaId');
    this.revenueYear = this.route.snapshot.paramMap.get('revenueYear');

    if (this.esaId === null || this.esaId === "" || this.esaId === undefined) {
      alert("Employee filter not provided !");
      this.router.navigate(['/projectList']);
    } else if (this.revenueYear === null || this.revenueYear === "" || this.revenueYear === undefined || this.revenueYear.length !== 4) {
      this.revenueYear = this.currentYear.toString();
      this.router.navigate(['/employeeRevenue', this.esaId, this.revenueYear]);
    } else {
      this.employeeService.employeeList(this.esaId, this.revenueYear).pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
        console.log(data);
        if (data.length >= 1) {
          this.empList = data;
          let employeeFilter = this.empList[0]._id;
          this.getEmployeeRevenue(this.revenueYear, employeeFilter);
        } else {
          alert("No employee found for project " + this.esaId);
          this.router.navigate(['/projectList']);
        }
      });
    }
  }

  public getEmployeeRevenue(revenueYear: string, employeeFilter: string) {
    this.employeeService.employeeRevenue(revenueYear, employeeFilter).pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      console.log(data);
      if (data.length > 1) {
        this.empObj = data;
        this.empBaseDtl = this.empObj[0];
        this.empLeave = this.empObj[1].leaves;
        this.locHoliday = this.empObj[2].publicHolidays;
        this.empSplWrk = this.empObj[3].specialWorkDays.empSplWrk;
        this.locSplWrk = this.empObj[3].specialWorkDays.locSplWrk;
        this.buffer = this.empObj[4].buffers;
        this.revenue = this.empObj[5].revenue;
        this.totalRevenue = 0;
        this.totalCmiRevenue = 0;

        let sowDate = this.empBaseDtl["sowStart"];
        let splitStr = sowDate.split("-");
        this.sowStart = splitStr[1] + "-" + splitStr[2];

        sowDate = this.empBaseDtl["sowStop"];
        splitStr = sowDate.split("-");
        this.sowStop = splitStr[1] + "-" + splitStr[2];

        sowDate = this.empBaseDtl["foreseenSowStop"];
        if (sowDate.length > 0) {
          splitStr = sowDate.split("-");
          this.sowForesee = splitStr[1] + "-" + splitStr[2];
        } else {
          this.sowForesee = ""
        }

        this.revenue.forEach((revenueObj) => {
          this.totalRevenue += revenueObj.revenueAmount;
          this.totalCmiRevenue += revenueObj.cmiRevenueAmount;
        });
        this.dataReceived = true;
      } else {
        alert("No data found for " + this.esaId + " project !");
        this.router.navigate(['/projectList']);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}