import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EmployeeService } from 'src/app/services/employee.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-emp-dash-month-detail',
  templateUrl: './emp-dash-month-detail.component.html',
  styleUrls: ['./emp-dash-month-detail.component.css']
})
export class EmpDashMonthDetailComponent implements OnInit {

  private employeeBaseDetail = [];
  private monthData = [];
  private employeeLeave = [];
  private locationLeave = [];
  private empAddWork = [];
  private locAddWork = [];
  private bufferHour: number = 0;
  private soStart: Boolean = false;
  private soStop: Boolean = false;
  private soForecast: Boolean = false;
  private nonRev: Boolean = false;
  private billingCurrency: string = "";
  private workHourPerDay: number = 0;
  private billingRatePerHour: number = 0;
  private totalWorkHours: number = 0;
  private allocationHours: number = 0;
  private locLeaveHour: number = 0;
  private empLeaveHour: number = 0;
  private locAddWorkHour: number = 0;
  private empAddWorkHour: number = 0;

  private revenueYear: string = "";
  private monthIndex: string = "";
  private employeeFilter: string = "";
  private dailyDetail = [];
  private monthName: string = "";
  private dataBuilt: Boolean = false;

  private destroy$: Subject<Boolean> = new Subject<Boolean>();

  constructor(
    private dialogRef: MatDialogRef<EmpDashMonthDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public employeeCalendarParam: any,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    let calendarParam = this.employeeCalendarParam[0];
    this.revenueYear = calendarParam.revenueYear.toString();
    this.monthIndex = calendarParam.monthIndex.toString();
    this.employeeFilter = calendarParam.employeeFilter.toString();

    let monthlyCalendar = [];
    this.employeeService.getEmployeeMonthlyCalendar(this.revenueYear, this.monthIndex, this.employeeFilter).pipe(takeUntil(this.destroy$)).subscribe((employeeMonthlyCalendar: any[]) => {
      console.log(employeeMonthlyCalendar);
      monthlyCalendar = employeeMonthlyCalendar;
      this.employeeBaseDetail = employeeMonthlyCalendar[0];
      this.billingCurrency = this.employeeBaseDetail["currency"];
      this.workHourPerDay = this.employeeBaseDetail["workHourPerDay"];
      this.billingRatePerHour = this.employeeBaseDetail["billRatePerHour"];
      this.dailyDetail = employeeMonthlyCalendar[1].dateDetail;
      this.monthName = employeeMonthlyCalendar[1].monthName;
      if (employeeMonthlyCalendar[1].buffer !== undefined && employeeMonthlyCalendar[1].buffer !== null) {
        this.bufferHour += employeeMonthlyCalendar[1].buffer["hours"];
      }
      this.getMonthHours();
    });
  }

  private getMonthHours(): void {
    let soStartDate = new Date(this.employeeBaseDetail["sowStart"]);
    let soStopDate = new Date(this.employeeBaseDetail["sowStop"]);
    let soForecastDate = new Date(this.employeeBaseDetail["sowStop"]);

    let selectedMonth = new Date(this.monthName);
    if (selectedMonth.getFullYear() === soStartDate.getFullYear() && selectedMonth.getMonth() === soStartDate.getMonth()) {
      this.soStart = true;
    } else if (selectedMonth.getFullYear() === soStopDate.getFullYear() && selectedMonth.getMonth() === soStopDate.getMonth()) {
      this.soStop = true;
    } else if (selectedMonth.getFullYear() === soForecastDate.getFullYear() && selectedMonth.getMonth() === soForecastDate.getMonth()) {
      this.soForecast = true;
    } else if (selectedMonth.getFullYear() < soStartDate.getFullYear() ||
      (selectedMonth.getFullYear() === soStartDate.getFullYear() && selectedMonth.getMonth() < soStartDate.getMonth()) ||
      (selectedMonth.getFullYear() === soForecastDate.getFullYear() && selectedMonth.getMonth() > soForecastDate.getMonth())) {
      this.nonRev = true;
    }

    if (this.employeeBaseDetail["forecastSowStop"].length > 0) {
      soForecastDate = new Date(this.employeeBaseDetail["forecastSowStop"]);
    }

    this.dailyDetail.forEach((dateBucket) => {
      let date = new Date(dateBucket.date);
      console.log(date);
      let employeeLeave = dateBucket.leaves;
      let locationLeave = dateBucket.publicHolidays;
      let empExtraHour = dateBucket.specialWorkDays["empSplWrk"];
      let locExtraHour = dateBucket.specialWorkDays["locSplWrk"];
      let noLeavesAndExtras = false;

      let iEmpLeaveHour: number = 0;
      let iEmpAddWorkHour: number = 0;
      let iLocLeaveHour: number = 0;
      let iLocAddWorkHour: number = 0;
      let iBusinessHour: number = this.workHourPerDay;
      let iEmpWorkHour: number = this.workHourPerDay;

      if (employeeLeave.length === 1) {
        let leaveStart = new Date(employeeLeave[0].startDate);
        if (date.getDate() === leaveStart.getDate()) {
          this.employeeLeave.push(employeeLeave[0]);
        }
      }

      if (locationLeave.length === 1) {
        let leaveStart = new Date(locationLeave[0].startDate);
        if (date.getDate() === leaveStart.getDate()) {
          this.locationLeave.push(locationLeave[0]);
        }
      }

      if (empExtraHour.length === 1) {
        empExtraHour.forEach((extraHour) => {
          this.empAddWork.push(extraHour);
        });
      }

      if (locExtraHour.length === 1) {
        let workStart = new Date(locExtraHour[0].startDate);
        if (date.getDate() === workStart.getDate()) {
          this.locAddWork.push(locExtraHour[0]);
        }
      }

      if (employeeLeave.length === 0 && locationLeave.length === 0 && empExtraHour.length === 0 && locExtraHour.length === 0) {
        noLeavesAndExtras = true;
      }

      console.log("before: " + this.allocationHours);

      if (date.getTime() >= soStartDate.getTime() && (date.getTime() <= soStopDate.getTime() || date.getTime() <= soForecastDate.getTime())) {
        /* since we are within SO, calculate employee leave hours, location holiday hours
        and any extra that has been adeed for both employee and location alike */
        if (date.getDay() > 0 && date.getDay() < 6 && noLeavesAndExtras === true) {
          this.allocationHours += iBusinessHour;
          this.totalWorkHours += iBusinessHour;
        } else if (date.getDay() > 0 && date.getDay() < 6) { /* weekday */
          if (locationLeave.length === 1) { /* location holiday */
            if (locationLeave[0].halfDay === "N") {
              this.locLeaveHour += iBusinessHour;
              iLocLeaveHour = iBusinessHour;
            } else if (locationLeave[0].halfDay === "Y") {
              if ((iBusinessHour % 2) === 0) {
                this.locLeaveHour += iBusinessHour / 2;
                iLocLeaveHour = iBusinessHour / 2;
              } else {
                this.locLeaveHour += (iBusinessHour + 1) / 2;
                iLocLeaveHour += (iBusinessHour + 1) / 2;
              }
            }

            if (locExtraHour.length === 1) { /* over-riding location holiday */
              if (locExtraHour[0].halfDay === "N") {
                this.locAddWorkHour += iBusinessHour;
                iLocAddWorkHour = iBusinessHour;
              } else if (locExtraHour[0].halfDay === "Y") {
                if ((iBusinessHour % 2) === 0) {
                  this.locAddWorkHour += iBusinessHour / 2;
                  iLocAddWorkHour = iBusinessHour / 2;
                } else {
                  this.locAddWorkHour += (iBusinessHour + 1) / 2;
                  iLocAddWorkHour = (iBusinessHour + 1) / 2;
                }
              }
            }

            if (((iBusinessHour - iLocLeaveHour) + iLocAddWorkHour) < iBusinessHour) {
              iBusinessHour = ((iBusinessHour - iLocLeaveHour) + iLocAddWorkHour);
            }

            if (iBusinessHour < 0) {
              iBusinessHour = 0;
            }

            /* consider extra work hour from employee only if we are over-riding a location holiday */
            /* also, ensure that we are considering any self leaves opted that overlap such business days */
            if (iBusinessHour > 0 && employeeLeave.length === 1) { /* we are over-riding a location holiday and employee leave overlaps it */
              this.totalWorkHours += iBusinessHour;
              if (employeeLeave[0].halfDay === "N") {
                iEmpLeaveHour = iBusinessHour;
              } else if (employeeLeave[0].halfDay === "Y" && employeeLeave[0].leaveHour === 0) {
                if (iBusinessHour % 2 === 0) {
                  iEmpLeaveHour = iBusinessHour / 2;
                } else {
                  iEmpLeaveHour = (iBusinessHour + 1) / 2;
                }
              } else if (employeeLeave[0].halfDay === "Y" && employeeLeave[0].leaveHour > 0) {
                iEmpLeaveHour = parseInt(employeeLeave[0].leaveHour, 10);
              }

              /* check if employee is overriding the opted personal leave */
              if (empExtraHour.length === 1) {
                iEmpWorkHour = parseInt(empExtraHour[0].workHour, 10);
              }

              if (((iBusinessHour - iEmpLeaveHour) + iEmpWorkHour) > iBusinessHour) {
                this.allocationHours += iBusinessHour;
              } else if (iEmpWorkHour >= iEmpLeaveHour) {
                this.allocationHours += iEmpWorkHour;
              } else {
                this.allocationHours += ((iBusinessHour - iEmpLeaveHour) + iEmpWorkHour);
              }
            } else if (iBusinessHour === 0 && empExtraHour.length === 1) { /* it's a location holiday and employee has opted to work */
              this.empAddWorkHour += iEmpWorkHour;
            } else if (iBusinessHour > 0) { /* no personal leave has been opted during this location holiday */
              this.allocationHours += iBusinessHour;
              this.totalWorkHours += iBusinessHour;
            }
          } else if (employeeLeave.length === 1) { /* employee personal leave */
            this.totalWorkHours += iBusinessHour;
            if (employeeLeave[0].halfDay === "N") {
              iEmpLeaveHour = iBusinessHour;
            } else if (employeeLeave[0].halfDay === "Y" && employeeLeave[0].leaveHour === 0) {
              if (iBusinessHour % 2 === 0) {
                iEmpLeaveHour = iBusinessHour / 2;
              } else {
                iEmpLeaveHour = (iBusinessHour + 1) / 2;
              }
            } else if (employeeLeave[0].halfDay === "Y" && employeeLeave[0].leaveHour > 0) {
              iEmpLeaveHour = parseInt(employeeLeave[0].leaveHour, 10);
            }

            if (empExtraHour.length === 1) { /* over-riding personal leave */
              iEmpWorkHour = parseInt(empExtraHour[0].workHour, 10);
              this.empAddWorkHour += iEmpWorkHour;
            }

            if (((iBusinessHour - iEmpLeaveHour) + iEmpWorkHour) > iBusinessHour) {
              this.allocationHours += iBusinessHour;
            } else if (iEmpWorkHour >= iEmpLeaveHour) {
              this.allocationHours += iEmpWorkHour;
            } else {
              this.allocationHours += ((iBusinessHour - iEmpLeaveHour) + iEmpWorkHour);
            }
          } else { /* regular working day */
            this.allocationHours += iBusinessHour;
            this.totalWorkHours += iBusinessHour;
          }
        } else if (date.getDay() === 0 || date.getDay() === 6) {
          if (empExtraHour.length === 1) {
            if (empExtraHour[0].halfDay === "N") {
              this.empAddWorkHour += iBusinessHour;
              this.allocationHours += iBusinessHour;
            } else if (empExtraHour[0].halfDay === "Y") {
              this.empAddWorkHour += empExtraHour[0].workHour;
              this.allocationHours += empExtraHour[0].workHour;
            }
          }

          if (locExtraHour.length === 1) {
            if (locExtraHour[0].halfDay === "N") {
              this.totalWorkHours += iBusinessHour;
              this.locAddWorkHour += iBusinessHour;
            } else if (locExtraHour[0].halfDay === "Y") {
              if ((iBusinessHour % 2) === 0) {
                this.totalWorkHours += iBusinessHour / 2;
                this.locAddWorkHour += iBusinessHour / 2;
              } else {
                this.totalWorkHours += (iBusinessHour + 1) / 2;
                this.locAddWorkHour += (iBusinessHour + 1) / 2;
              }
            }
          }
        }
      }
      console.log("after: " + this.allocationHours);
    });
    this.dataBuilt = true;
  }

  private calcWeekDays(startDate: Date, stopDate: Date): number {
    let calcDate = new Date(startDate);
    let totalDays = 0;
    for (; calcDate.getTime() <= stopDate.getTime(); calcDate.setDate(calcDate.getDate() + 1)) {
      let dayIdx = calcDate.getDay();
      if (dayIdx > 0 && dayIdx < 6) {
        totalDays++;
      }
    }
    return totalDays;
  }

  private calcDays(startDate: Date, stopDate: Date): number {
    let calcDate = new Date(startDate);
    let totalDays = 0;
    for (; calcDate.getTime() <= stopDate.getTime(); calcDate.setDate(calcDate.getDate() + 1)) {
      totalDays++;
    }
    return totalDays;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
