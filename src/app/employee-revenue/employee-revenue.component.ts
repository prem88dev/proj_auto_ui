import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-project-revenue',
  templateUrl: './employee-revenue.component.html',
  styleUrls: ['./employee-revenue.component.css']
})
export class EmployeeRevenueComponent implements OnInit {

  private empList = [];
  private empObj = [];
  private empBaseDtl: string = "";
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
  private dataReceived: Boolean = false;
  private currentYear = new Date().getFullYear();
  private esaId: string = "";
  private revenueYear: string = "";
  private minMaxYear = [];
  private selectedYear: number = 0;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

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
      this.employeeService.getMinMaxAllocYear(this.esaId).pipe(takeUntil(this.destroy$)).subscribe((projMinMaxYear: any[]) => {
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

      console.log(this.minMaxYear)

      this.employeeService.employeeList(this.esaId, this.revenueYear).pipe(takeUntil(this.destroy$)).subscribe((projectRevenue: any[]) => {
        console.log(projectRevenue);
        if (projectRevenue.length >= 1) {
          this.empList = projectRevenue;
          let selectedEmployee = this.empList[0]._id;
          this.getEmployeeRevenue(this.revenueYear, selectedEmployee);
        } else {
          alert("No employee found for project " + this.esaId);
          this.router.navigate(['/projectList']);
        }
      });
    }
  }

  public getEmployeeRevenue(revenueYear: string, selectedEmployee: string) {
    this.employeeService.employeeRevenue(revenueYear, selectedEmployee).pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
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
        this.sowForeCast = "";
        this.revenueYear = revenueYear;

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

  public onChange(selectedYear: string, selectedEmployee: string) {
    console.log(selectedYear);
    console.log(selectedEmployee);
    this.getEmployeeRevenue(selectedYear, selectedEmployee);
    this.dataReceived = false;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}