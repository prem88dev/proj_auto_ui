import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { EmployeeService } from '../services/employee.service'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProjDashMonthDetailComponent } from './proj-dash-month-detail/proj-dash-month-detail.component';

@Component({
  selector: 'app-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.css'],
  entryComponents: [ProjDashMonthDetailComponent]
})

export class ProjectDashboardComponent implements OnInit {

  private dashboardRevenue = [];
  private projectWorkforce = [];
  private empList = [];
  private employeesAvailable = 0;
  private columns = [];
  private minMaxYear = [];
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
  private dashboardDump = [];

  private destroy$: Subject<Boolean> = new Subject<Boolean>();

  constructor(
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private router: Router,
    private matDialog: MatDialog,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
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

    let dashboardYearHttpParam = this.route.snapshot.paramMap.get('revenueYear');
    let projectIdHttpParam = this.route.snapshot.paramMap.get('projectId');
    if (dashboardYearHttpParam === undefined || dashboardYearHttpParam === null || dashboardYearHttpParam.length !== 4) {
      this.revenueYear = this.currentYear.toString();
    } else {
      this.revenueYear = dashboardYearHttpParam;
    }

    if (projectIdHttpParam === undefined || projectIdHttpParam === null || projectIdHttpParam === "") {
      this.projectService.projectList().pipe(takeUntil(this.destroy$)).subscribe((projectListDump: any[]) => {
        this.selectedProject = projectListDump[0]._id;
      });
    } else {
      this.selectedProject = projectIdHttpParam;
    }
    this.router.navigate(['/dashboard', this.revenueYear, this.selectedProject]);
    this.refreshPage();
  }

  public navToEmployeeRevenue(selectedYear: string, selectedEmployee: string) {
    this.revenueYear = selectedYear;
    this.router.navigate(['/employeeRevenue', selectedYear, selectedEmployee]);
  }

  public refreshPage() {
    this.employeeService.getEmployee("", this.revenueYear).pipe(takeUntil(this.destroy$)).subscribe((projEmpList: any[]) => {
      this.empList = projEmpList;
      this.employeesAvailable = this.empList.length;
    });
    this.projectService.projectRevenue(this.selectedProject, this.revenueYear).pipe(takeUntil(this.destroy$)).subscribe((projectRevenueDump: any[]) => {
      if (projectRevenueDump.length >= 1) {
        this.dashboardDump = projectRevenueDump;
        this.dashboardRevenue = projectRevenueDump[projectRevenueDump.length - 1].projectRevenue;
        this.projectBillingCurrency = projectRevenueDump[projectRevenueDump.length - 1].currency;
        this.refreshDashboardRevenue = true;
      } else {
        this.refreshDashboardRevenue = false;
      }
    });
    this.router.navigate(['/dashboard', this.revenueYear, this.selectedProject]);
  }

  public onRevenueYearChange(forYear: string, forProject: string) {
    this.revenueYear = forYear;
    this.selectedProject = forProject;
    this.refreshPage();
  }

  public onProjectChange(selectedTab: number, forYear: string) {
    if (forYear !== "" || forYear.trim() !== "Select Year") {
      this.revenueYear = forYear;
    }
    this.selProjectObj = this.empList[selectedTab];
    this.selectedProject = this.selProjectObj["_id"].toString();
    this.refreshPage();
  }

  public dashboardMonthDetailView(monthIndex: string) {
    let dashboardMonthData = [];
    let monthTotal = this.dashboardDump[this.dashboardDump.length - 1].projectRevenue[monthIndex];
    let revenueCurrency = this.dashboardDump[this.dashboardDump.length - 1].currency;
    let revenueObj = [];
    this.dashboardDump.forEach((empObj, idx) => {
      if (idx < (this.dashboardDump.length - 1)) {
        let empDtl = empObj[0];
        let empMonthRev = empObj[5]["revenue"][monthIndex];
        revenueObj.push({ "empFname": empDtl.empFname, "empLname": empDtl.empLname, "revenueAmount": empMonthRev.revenueAmount, "cmiRevenueAmount": empMonthRev.cmiRevenueAmount });
      }
    });
    dashboardMonthData.push({ "employeeRevenue": revenueObj, "monthTotal": monthTotal, "revenueCurrency": revenueCurrency });
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = dashboardMonthData;
    this.matDialog.open(ProjDashMonthDetailComponent, dialogConfig);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}