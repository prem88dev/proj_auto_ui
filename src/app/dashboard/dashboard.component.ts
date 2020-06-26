import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { ProjectService } from '../services/project.service';
import { EmployeeService } from '../services/employee.service'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabGroup, MatTab, MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private dashboardRevenue = [];
  private projectList = [];
  private projectWorkforce = [];
  private empList = [];
  private employeesAvailable = 0;
  private columns = [];
  private minMaxYear = [];
  private dashboardDetail: Boolean = false;
  private employeeDetail: Boolean = false;
  private empObj = [];
  private empBaseDtl = [];
  private empLeave: string = "";
  private locHoliday: string = "";
  private empSplWrk: string = "";
  private locSplWrk: string = "";
  private buffer: string = "";
  private revenue = [];
  private sowStart: string = "";
  private sowStop: string = "";
  private sowForeCast: string = "";
  private totalRevenue: number = 0;
  private totalCmiRevenue: number = 0;
  private revenueYear: string = "";
  private currentYear = new Date().getFullYear();
  private selectedProject = [];
  private noRevForSelEmp = false;

  destroy$: Subject<Boolean> = new Subject<Boolean>();

  constructor(
    private dashboardService: DashboardService,
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.employeeDetail = false;
    let yearParam = this.activatedRoute.snapshot.paramMap.get('revenueYear');
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

    this.employeeService.getMinMaxAllocYear("").pipe(takeUntil(this.destroy$)).subscribe((projMinMaxYear: any[]) => {
      let startYear = this.currentYear;
      let stopYear = this.currentYear;
      if (projMinMaxYear.length === 1) {
        startYear = projMinMaxYear[0].minYear;
        stopYear = projMinMaxYear[0].maxYear;
      }

      if (startYear < stopYear) {
        for (let listStart = startYear; listStart <= stopYear; listStart++) {
          /*this.minMaxYear.push({ "id": listStart, "label": listStart });*/
          this.minMaxYear.push(listStart);
        }
      } else if (startYear === stopYear) {
        this.minMaxYear.push(startYear);
      }
    });

    this.projectService.projectList().pipe(takeUntil(this.destroy$)).subscribe((projectList: any[]) => {
      this.projectList = projectList;
    });

    this.employeeService.allEmployees().pipe(takeUntil(this.destroy$)).subscribe((projectWorkforce: any[]) => {
      this.projectWorkforce = projectWorkforce;
    });

    this.dashboardDetail = true;
  }

  public getEmployeeRevenue(selectedYear: string, selectedEmployee: string) {
    this.dashboardDetail = false;
    let splitStr = selectedEmployee.split("-");
    this.employeeService.projectEmployees(splitStr[0].toString(), selectedYear).pipe(takeUntil(this.destroy$)).subscribe((projEmpList: any[]) => {
      this.empList = projEmpList;
      this.employeesAvailable = this.empList.length;
    });
    this.employeeService.employeeRevenue(selectedYear, selectedEmployee).pipe(takeUntil(this.destroy$)).subscribe((empRev: any[]) => {
      if (empRev.length > 1) {
        this.empObj = empRev;
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

        let sowStart = new Date(this.empBaseDtl["sowStart"]);
        let sowStop = new Date(this.empBaseDtl["sowStop"]);
        let sowForeSeen = new Date(sowStop);
        if (this.empBaseDtl["foreseenSowStop"].length > 0) {
          sowForeSeen = new Date(this.empBaseDtl["foreseenSowStop"]);
        }

        let iRevenueYear = parseInt(this.revenueYear, 10);
        if (iRevenueYear < sowStart.getFullYear() || (iRevenueYear > sowStop.getFullYear() && iRevenueYear > sowForeSeen.getFullYear())) {
          this.noRevForSelEmp = true;
        } else {
          this.noRevForSelEmp = false;
        }

        console.log(this.noRevForSelEmp);
        this.revenue.forEach((revenueObj) => {
          this.totalRevenue += revenueObj.revenueAmount;
          this.totalCmiRevenue += revenueObj.cmiRevenueAmount;
        });
      } else {
        alert("No data found");
      }
      this.employeeDetail = true;
    });
  }

  public onChange(selectedYear: string, selectedEmployee: string) {
    this.getEmployeeRevenue(selectedYear, selectedEmployee);
  }

  public goToHome() {
    this.router.navigateByUrl('/home');
  }

  public getDashboardRevenue(eventObj: MatTabChangeEvent) {
    this.selectedProject = this.projectWorkforce[eventObj.index][0];
    this.projectService.projectRevenue(this.selectedProject["_id"], this.revenueYear).pipe(takeUntil(this.destroy$)).subscribe((projectRevenue: any[]) => {
      this.dashboardRevenue = projectRevenue[projectRevenue.length - 1].projectRevenue;
    });
    this.employeeDetail = false;
    this.dashboardDetail = true;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
