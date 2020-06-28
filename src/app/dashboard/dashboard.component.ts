import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { EmployeeService } from '../services/employee.service'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabGroup } from '@angular/material';

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
  private showDashboard: Boolean = false;
  private showEmployee: Boolean = false;
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
  private selProjectObj = [];
  private selectedProject: string = "";
  private noRevForSelEmp = false;
  private projectBillingCurrency = "";
  private refreshDashboardRevenue: Boolean = false;

  destroy$: Subject<Boolean> = new Subject<Boolean>();

  constructor(
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }


  public getEmployeeRevenue(selectedYear: string, selectedEmployee: string) {
    this.showDashboard = false;
    let splitStr = selectedEmployee.split("-");
    if (selectedYear !== "" && selectedYear.trim() !== "Select Year" && selectedYear.length === 4) {
      this.revenueYear = selectedYear
    } else if (selectedYear.trim() === "Select Year") {
      this.revenueYear = this.currentYear.toString();
    }

    this.employeeService.listProjectEmployees("", selectedYear).pipe(takeUntil(this.destroy$)).subscribe((projEmpList: any[]) => {
      this.empList = projEmpList;
      this.employeesAvailable = this.empList.length;
    });

    this.employeeService.employeeRevenue(selectedYear, selectedEmployee).pipe(takeUntil(this.destroy$)).subscribe((empRev: any[]) => {
      if (empRev.length > 1) {
        console.log(empRev);
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

        this.revenue.forEach((revenueObj) => {
          this.totalRevenue += revenueObj.revenueAmount;
          this.totalCmiRevenue += revenueObj.cmiRevenueAmount;
        });
      } else {
        alert("No data found");
      }
      this.showEmployee = true;
    });
  }

  public refreshDashboard(forYear: string, forProject: string) {
    this.showDashboard = true;
    this.revenueYear = forYear;
    this.employeeService.listProjectEmployees("", this.revenueYear).pipe(takeUntil(this.destroy$)).subscribe((projEmpList: any[]) => {
      this.empList = projEmpList;
      console.log(this.empList);
      this.employeesAvailable = this.empList.length;
    });
    this.projectService.projectRevenue(forProject, forYear).pipe(takeUntil(this.destroy$)).subscribe((projectRevenueDump: any[]) => {
      if (projectRevenueDump.length >= 1) {
        this.selectedProject = forProject;
        this.dashboardRevenue = projectRevenueDump[projectRevenueDump.length - 1].projectRevenue;
        this.projectBillingCurrency = projectRevenueDump[projectRevenueDump.length - 1].currency;
        this.refreshDashboardRevenue = true;
      } else {
        this.refreshDashboardRevenue = false;
      }
    });
  }

  public goToHome() {
    this.router.navigate(['/home']);
  }

  public employeeMonthDetailView(monthIndex: string) {
    console.log(this.empBaseDtl);
    let startDate = new Date(parseInt(this.revenueYear, 10), parseInt(monthIndex, 10), 1);
    let stopDate = new Date(parseInt(this.revenueYear, 10), parseInt(monthIndex, 10) + 1, 0);
    let totalWorkHours = 0;
    for (let nextDate = startDate; nextDate.getTime() <= stopDate.getTime(); nextDate.setDate(nextDate.getDate() + 1)) {
      if (nextDate.getDay() > 0 && nextDate.getDay() < 6) {
        totalWorkHours += parseInt(this.empBaseDtl["wrkHrPerDay"], 10);
      }
    }
    console.log(totalWorkHours);
  }

  public dashboardMonthDetailView(monthIndex: string, projectId: string) {
  }

  public getDashboardRevenue(selectedTab: MatTabGroup, forYear: string) {
    let tabIndex: number = selectedTab["index"];
    this.selProjectObj = this.empList[tabIndex];
    let forProject = this.selProjectObj["_id"].toString();
    if (forYear == "" || forYear == "Select Year") {
      forYear = this.revenueYear;
    }
    this.refreshDashboard(forYear, forProject);
  }

  ngOnInit() {
    this.revenueYear = this.currentYear.toString();
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

    this.projectService.projectList().pipe(takeUntil(this.destroy$)).subscribe((projectListDump: any[]) => {
      this.projectList = projectListDump;
    });

    this.employeeService.listAllEmployees().pipe(takeUntil(this.destroy$)).subscribe((projectWorkforce: any[]) => {
      this.empList = projectWorkforce;
    });

    this.refreshDashboardRevenue = true;
    this.showDashboard = true;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
