import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  private dashboardYearHttpParam: string = "";
  private projectIdHttpParam: string = "";
  private dashboardRevenue = [];
  private empList = [];
  private minMaxYear = [];
  private revenueYear: string = "";
  private currentYear = new Date().getFullYear();
  private selectedProject: string = "";
  private projectBillingCurrency: string = "";
  private refreshDashboardRevenue: Boolean = false;
  private dashboardDump = [];
  private projDesc: string = "";
  private selectedTabIndex: number = 0;
  private moveToTab: number = 0;
  private goToTab: Boolean = true;

  private destroy$: Subject<Boolean> = new Subject<Boolean>();

  constructor(
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private router: Router,
    private matDialog: MatDialog,
    private route: ActivatedRoute,
    private change: ChangeDetectorRef
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

      this.employeeService.getEmployee("", this.revenueYear).pipe(takeUntil(this.destroy$)).subscribe((projEmpList: any[]) => {
        this.empList = projEmpList;
      });

      this.dashboardYearHttpParam = this.route.snapshot.paramMap.get('revenueYear');
      this.projectIdHttpParam = this.route.snapshot.paramMap.get('projectId');
      if (this.dashboardYearHttpParam === undefined || this.dashboardYearHttpParam === null || this.dashboardYearHttpParam.length !== 4) {
        this.revenueYear = this.currentYear.toString();
      } else {
        this.revenueYear = this.dashboardYearHttpParam;
      }

      let projectList = [];
      this.projectService.projectList().pipe(takeUntil(this.destroy$)).subscribe((projectListDump: any[]) => {
        projectList = projectListDump;

        if (this.projectIdHttpParam !== undefined && this.projectIdHttpParam !== null && this.projectIdHttpParam !== "") {
          this.selectedProject = this.projectIdHttpParam;
          projectList.forEach((project, idx) => {
            if (this.selectedProject === project._id.toString()) {
              this.moveToTab = idx;
            }
          });
        } else {
          this.selectedProject = projectList[0]._id.toString();
          this.moveToTab = 0;
        }
        this.router.navigate(['/dashboard', this.revenueYear, this.selectedProject]);
      });
    });
  }

  public goToEmployeeRevenue(selectedYear: string, selectedEmployee: string) {
    this.revenueYear = selectedYear;
    this.router.navigate(['/employeeRevenue', selectedYear, selectedEmployee]);
  }

  public buildDashboardRevenue(): void {
    this.router.navigate(['/dashboard', this.revenueYear, this.selectedProject]);
    this.employeeService.getEmployee("", this.revenueYear).pipe(takeUntil(this.destroy$)).subscribe((projEmpList: any[]) => {
      this.empList = projEmpList;
    });
    
    this.projectService.projectRevenue(this.selectedProject, this.revenueYear).pipe(takeUntil(this.destroy$)).subscribe((projectRevenueDump: any[]) => {
      if (projectRevenueDump.length >= 1) {
        this.dashboardDump = projectRevenueDump;
        this.dashboardRevenue = projectRevenueDump[projectRevenueDump.length - 1].projectRevenue;
        this.projectBillingCurrency = projectRevenueDump[projectRevenueDump.length - 1].currency;
        this.projDesc = projectRevenueDump[0][0].esaDesc;
        this.refreshDashboardRevenue = true;
      } else {
        this.refreshDashboardRevenue = false;
      }

      if (this.goToTab === true) {
        this.goToTab = false;
        window.setTimeout(() => {
          this.selectedTabIndex = this.moveToTab;
          this.change.markForCheck();
        });
      }
    });
  }

  public onRevenueYearChange(forYear: string) {
    if (forYear.trim() !== "Select Year") {
      this.revenueYear = forYear;
    } else if (forYear.trim() === "Select Year") {
      this.revenueYear = this.currentYear.toString();
    }
    this.buildDashboardRevenue();
  }

  public onProjectChange(selectedTab: number) {
    this.selectedProject = this.empList[selectedTab]["_id"].toString();
    this.selectedTabIndex = selectedTab;
    this.buildDashboardRevenue();
  }

  public dashboardMonthDetailView(monthIndex: string) {
    let projectMonthData = [];
    let monthTotal = this.dashboardDump[this.dashboardDump.length - 1].projectRevenue[monthIndex];
    let revenueCurrency = this.dashboardDump[this.dashboardDump.length - 1].currency;
    let revenueObj = [];
    this.dashboardDump.forEach((employee, idx) => {
      if (idx < (this.dashboardDump.length - 1)) {
        let revenue = employee[1].monthlyDetail[monthIndex].revenue;
        revenueObj.push({ "firstName": employee[0].firstName, "lastName": employee[0].lastName, "sowStart": employee[0].sowStart, "sowStop": employee[0].sowStop, "sowForeCast": employee[0].forecastSowStop, "revenueAmount": revenue.revenueAmount, "cmiRevenueAmount": revenue.cmiRevenueAmount });
      }
    });
    projectMonthData.push({ "employeeRevenue": revenueObj, "monthTotal": monthTotal, "revenueCurrency": revenueCurrency });
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = projectMonthData;
    this.matDialog.open(ProjDashMonthDetailComponent, dialogConfig);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}