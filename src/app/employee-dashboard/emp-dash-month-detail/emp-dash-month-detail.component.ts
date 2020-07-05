import { Component, OnInit, inject, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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
  private empAddlWorkHour = [];
  private locAddlWorkHour = [];
  private bufferHour: number = 0;
  private soStart = false;
  private soStop = false;
  private soForecast = false;
  private nonRev = false;

  constructor(
    private dialogRef: MatDialogRef<EmpDashMonthDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public employeeMonthData: any
  ) { }

  ngOnInit(): void {
    console.log(this.employeeMonthData);
    this.employeeBaseDetail = this.employeeMonthData[0];
    this.monthData = this.employeeMonthData[1];
    console.log(this.monthData);
    if (this.monthData["buffers"].length > 0) {
      this.bufferHour = this.monthData["buffers"].hours;
    }
    let selectedMonth = new Date(this.monthData["monthName"]);
    let soStartDate = new Date(this.employeeBaseDetail["sowStart"]);
    let soStopDate = new Date(this.employeeBaseDetail["sowStop"]);
    let soForecastDate = new Date(this.employeeBaseDetail["sowStop"]);
    if (this.employeeBaseDetail["forecastSowStop"].length > 0) {
      soForecastDate = new Date(this.employeeBaseDetail["forecastSowStop"]);
    }
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
    this.employeeLeave = this.monthData["leaves"];
    this.locationLeave = this.monthData["publicHolidays"];
    this.empAddlWorkHour = this.monthData["specialWorkDays"].empSplWrk;
    this.locAddlWorkHour = this.monthData["specialWorkDays"].locSplWrk;
  }

}
