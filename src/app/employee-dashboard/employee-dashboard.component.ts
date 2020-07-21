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
  private employeeFilter: string = "";
  private currentYear = new Date().getFullYear();
  private minMaxYear = [];
  private empList = [];
  private destroy$: Subject<Boolean> = new Subject<Boolean>();
  private availableEmployees: number = 0;
  private employee = [];
  private employeeDetail = [];
  private employeeMonthlyDetail = [];
  private empLeave = [];
  private locHoliday = [];
  private empSplWrk = [];
  private locSplWrk = [];
  private buffer = [];
  private revenue = [];
  private employeeBillingCurrency: string = "";
  private totalRevenue: number = 0;
  private totalCmiRevenue: number = 0;
  private sowForeCast: string = "";
  private sowStart: string = "";
  private sowStop: string = "";
  private revenueAvailable: Boolean = false;
  private selectedProject: string = "";
  private projectFound: Boolean = false;
  private employeeFound: Boolean = false;
  private filterOk: Boolean = true;

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

      /* parse url parameters */
      let yearParam = this.route.snapshot.paramMap.get('revenueYear');
      let employeeFilterParam = this.route.snapshot.paramMap.get('employeeFilter');
      this.getEmployeeRevenue(yearParam, employeeFilterParam);
    });
  }

  private validateAndSetRevenueFilter(forYear: string, forEmployee: string): Boolean {
    /* validate revenue year */
    if (forYear === undefined || forYear === null || forYear.length !== 4 || isNaN(parseInt(forYear, 10)) || 1000 > parseInt(forYear, 10) || parseInt(forYear, 10) > 9999) {
      this.revenueYear = this.currentYear.toString(); /* if year is not proper, set to current year */
    } else {
      this.revenueYear = forYear;
    }

    /* vaildate employee filter */
    if (forEmployee !== undefined && forEmployee !== null && forEmployee.length !== 0) {
      let empFilterSplit = forEmployee.split("-");

      if (empFilterSplit.length !== 5) {
        this.filterOk = false;
      } else {
        empFilterSplit.forEach((whereClause) => {
          if (whereClause.length === 0 || isNaN(parseInt(whereClause, 10))) {
            this.filterOk = false;
          }
        });
      }

      this.employeeFilter = forEmployee;

      if (this.filterOk === true) {
        this.selectedProject = empFilterSplit[0].toString();
      }
    }

    return this.filterOk;
  }

  public resetContainersAndFlags(): void {
    this.revenueYear = ""
    this.empList = [];
    this.availableEmployees = 0;
    this.employee = [];
    this.employeeDetail = [];
    this.empLeave = [];
    this.locHoliday = [];
    this.empSplWrk = [];
    this.locSplWrk = [];
    this.buffer = [];
    this.revenue = [];
    this.employeeBillingCurrency = "";
    this.totalRevenue = 0;
    this.totalCmiRevenue = 0;
    this.sowForeCast = "";
    this.sowStart = "";
    this.sowStop = "";
    this.revenueAvailable = false;
    this.selectedProject = "";
    this.projectFound = false;
    this.employeeFound = false;
    this.filterOk = true;
  }

  public getEmployeeRevenue(forYear: string, forEmployee: string): void {
    this.resetContainersAndFlags();
    if (this.validateAndSetRevenueFilter(forYear, forEmployee) === true) {
      this.employeeService.getEmployee("", this.revenueYear).pipe(takeUntil(this.destroy$)).subscribe((projectWorkforceDump: any[]) => {
        this.empList = projectWorkforceDump;
        projectWorkforceDump.forEach((project) => {
          if (this.selectedProject === project["_id"].toString()) {
            this.projectFound = true;
            this.availableEmployees = project.workforce.length;
            let projectWorkforce = project.workforce;
            projectWorkforce.forEach((employee) => {
              if (employee.employeeLinker === this.employeeFilter) {
                this.filterOk = true;
              }
            });
          }
        });
      });

      if (this.filterOk === true) {
        this.employeeService.employeeRevenue(this.revenueYear, this.employeeFilter).pipe(takeUntil(this.destroy$)).subscribe((employeeRevenueDump: any[]) => {
          if (employeeRevenueDump.length === 2) {
            this.employeeFound = true;
            this.employee = employeeRevenueDump;
            this.employeeDetail = this.employee[0];
            this.employeeMonthlyDetail = this.employee[1].monthlyDetail;
            this.employeeBillingCurrency = this.employeeDetail["currency"];
            this.employeeMonthlyDetail.forEach((eachMonth) => {
              this.revenue.push(eachMonth.revenue);
            });
            this.totalRevenue = 0;
            this.totalCmiRevenue = 0;
            this.sowForeCast = "";

            let sowDate = this.employeeDetail["sowStart"];
            let splitStr = sowDate.split("-");
            this.sowStart = splitStr[1] + "-" + splitStr[2];

            sowDate = this.employeeDetail["sowStop"];
            splitStr = sowDate.split("-");
            this.sowStop = splitStr[1] + "-" + splitStr[2];

            sowDate = this.employeeDetail["forecastSowStop"];
            if (sowDate.length > 0) {
              splitStr = sowDate.split("-");
              this.sowForeCast = splitStr[1] + "-" + splitStr[2];
            }

            let lSowStart = new Date(this.employeeDetail["sowStart"]);
            let lSowStop = new Date(this.employeeDetail["sowStop"]);
            let lSowForeCast = new Date(this.employeeDetail["sowStop"]);
            if (this.employeeDetail["forecastSowStop"].length > 0) {
              lSowForeCast = new Date(this.employeeDetail["forecastSowStop"]);
            }

            let iRevenueYear = parseInt(this.revenueYear, 10);
            if (iRevenueYear >= lSowStart.getFullYear() && (iRevenueYear <= lSowStop.getFullYear() || iRevenueYear <= lSowForeCast.getFullYear())) {
              this.revenueAvailable = true;
            } else {
              this.revenueAvailable = false;
            }

            this.revenue.forEach((revenueObj) => {
              this.totalRevenue += revenueObj.revenueAmount;
              this.totalCmiRevenue += revenueObj.cmiRevenueAmount;
            });
            this.router.navigate(['/employeeRevenue', this.revenueYear, this.employeeFilter]);
          } else {
            this.router.navigate(['/employeeRevenue', this.revenueYear, this.employeeFilter]);
            this.filterOk = false;
          }
        });
      } else {
        this.router.navigate(['/employeeRevenue', this.revenueYear, this.employeeFilter]);
      }
    }
  }

  public goToProjectDashboard(): void {
    this.router.navigate(['/dashboard', this.revenueYear, this.selectedProject]);
  }

  public employeeMonthDetailView(monthIndex: string): void {
    let calendarParam = [];
    calendarParam.push({"revenueYear": this.revenueYear, "monthIndex": monthIndex, "employeeFilter": this.employeeFilter});
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = calendarParam;
    this.matDialog.open(EmpDashMonthDetailComponent, dialogConfig);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}