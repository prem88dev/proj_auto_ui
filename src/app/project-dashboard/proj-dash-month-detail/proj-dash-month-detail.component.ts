import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-proj-dash-month-detail',
  templateUrl: './proj-dash-month-detail.component.html',
  styleUrls: ['./proj-dash-month-detail.component.css'],
  providers: [ProjDashMonthDetailComponent]
})
export class ProjDashMonthDetailComponent {

  private empRevObj = [];
  private monthRevObj = [];
  private revenueCurrency = "";
  private sowStart = "";
  private sowStop = "";
  private sowForeCast = "";

  constructor(
    private dialogRef: MatDialogRef<ProjDashMonthDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public projectMonthData: any
  ) { }

  ngOnInit(): void {
    this.empRevObj = this.projectMonthData[0].employeeRevenue;
    this.monthRevObj = this.projectMonthData[0].monthTotal;
    this.revenueCurrency = this.projectMonthData[0].revenueCurrency;
  }

  public close() {
    this.dialogRef.close();
  }

}
