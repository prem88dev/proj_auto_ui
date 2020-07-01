import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EmpDashMonthDetailComponent } from './emp-dash-month-detail/emp-dash-month-detail.component';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css'],
  entryComponents: [EmpDashMonthDetailComponent]
})

export class EmployeeDashboardComponent implements OnInit {

  private revenueYear: string = "";
  private currentYear = new Date().getFullYear();
  private minMaxYear = [];
  private empList = [];
  private destroy$: Subject<Boolean> = new Subject<Boolean>();
  private employeesAvailable: number = 0;
  private empObj = [];
  private empBaseDtl = [];
  private empLeave = [];
  private locHoliday = [];
  private empSplWrk = [];
  private locSplWrk = [];
  private buffer = [];
  private revenue = [];
  private totalRevenue: number = 0;
  private totalCmiRevenue: number = 0;
  private sowForeCast: string = "";
  private sowStart: string = "";
  private sowStop: string = "";
  private noRevForSelEmp: Boolean = false;
  private showEmployee = false;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private matDialog: MatDialog,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.employeeService.getMinMaxAllocYear("").pipe(takeUntil(this.destroy$)).subscribe((projMinMaxYear: any[]) => {
      let startYear = this.currentYear;
      let stopYear = this.currentYear;
      if (projMinMaxYear.length === 1) {
        startYear = projMinMaxYear[0].minYear;
        stopYear = projMinMaxYear[0].maxYear;
      }

      if (startYear < stopYear) {
        for (let listStart = startYear; listStart <= stopYear; listStart++) {
          this.minMaxYear.push(listStart);
        }
      } else if (startYear === stopYear) {
        this.minMaxYear.push(startYear);
      }
    });

    this.employeeService.getEmployee().pipe(takeUntil(this.destroy$)).subscribe((projectWorkforceDump: any[]) => {
      this.empList = projectWorkforceDump;
    });

    let yearParam = this.route.snapshot.paramMap.get('revenueYear');
    let employeeFilterParam = this.route.snapshot.paramMap.get('employeeFilter');
    if (yearParam === undefined || yearParam === null || yearParam.length !== 4) {
      this.revenueYear = this.currentYear.toString();
    } else {
      this.revenueYear = yearParam;
    }

    if (employeeFilterParam === undefined || employeeFilterParam === null || employeeFilterParam.length === 0) {
      this.router.navigate(['/dashboard', this.revenueYear]);
    } else {
      this.getEmployeeRevenue(this.revenueYear, employeeFilterParam);
    }

  }

  public getEmployeeRevenue(selectedYear: string, selectedEmployee: string) {
    if (selectedYear !== "" && selectedYear.trim() !== "Select Year" && selectedYear.length === 4) {
      this.revenueYear = selectedYear;
    } else if (selectedYear.trim() === "Select Year") {
      this.revenueYear = this.currentYear.toString();
    }

    this.employeeService.getEmployee("", selectedYear).pipe(takeUntil(this.destroy$)).subscribe((projEmpListDump: any[]) => {
      this.empList = projEmpListDump;
      this.employeesAvailable = this.empList.length;
    });

    this.employeeService.employeeRevenue(selectedYear, selectedEmployee).pipe(takeUntil(this.destroy$)).subscribe((employeeRevenueDump: any[]) => {
      if (employeeRevenueDump.length > 1) {
        this.empObj = employeeRevenueDump;
        this.empBaseDtl = this.empObj[0];
        this.empLeave = this.empObj[1].leaves;
        this.locHoliday = this.empObj[2].publicHolidays;
        this.empSplWrk = this.empObj[3].specialWorkDays.empSplWrk;
        this.locSplWrk = this.empObj[3].specialWorkDays.locSplWrk;
        this.buffer = this.empObj[4].buffers;
        this.revenue = this.empObj[5].revenue;
        this.totalRevenue = 0;
        this.totalCmiRevenue = 0;
        this.sowForeCast = "";
        this.revenueYear = selectedYear;

        let sowDate = this.empBaseDtl["sowStart"];
        let splitStr = sowDate.split("-");
        this.sowStart = splitStr[1] + "-" + splitStr[2];

        sowDate = this.empBaseDtl["sowStop"];
        splitStr = sowDate.split("-");
        this.sowStop = splitStr[1] + "-" + splitStr[2];

        sowDate = this.empBaseDtl["foreseenSowStop"];
        if (sowDate.length > 0) {
          splitStr = sowDate.split("-");
          this.sowForeCast = splitStr[1] + "-" + splitStr[2];
        }

        let lSowStart = new Date(this.empBaseDtl["sowStart"]);
        let lSowStop = new Date(this.empBaseDtl["sowStop"]);
        let lSowForeCast = new Date(this.empBaseDtl["sowStop"]);
        if (this.empBaseDtl["foreseenSowStop"].length > 0) {
          lSowForeCast = new Date(this.empBaseDtl["foreseenSowStop"]);
        }

        let iRevenueYear = parseInt(this.revenueYear, 10);
        if (iRevenueYear < lSowStart.getFullYear() || (iRevenueYear > lSowStop.getFullYear() && iRevenueYear > lSowForeCast.getFullYear())) {
          this.noRevForSelEmp = true;
        } else {
          this.noRevForSelEmp = false;
        }

        this.revenue.forEach((revenueObj) => {
          this.totalRevenue += revenueObj.revenueAmount;
          this.totalCmiRevenue += revenueObj.cmiRevenueAmount;
        });
      }
    });
  }

  public goToHome(): void {
    this.router.navigate(['/dashboard', this.revenueYear]);
  }

  public employeeMonthDetailView(monthIndex: string) {
    const dialogConfig = new MatDialogConfig();
    /* dialogConfig.data = dashboardMonthData; */
    this.matDialog.open(EmpDashMonthDetailComponent, dialogConfig);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
