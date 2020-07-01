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

  constructor(
    private dialogRef: MatDialogRef<ProjDashMonthDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.empRevObj = this.data[0].employeeRevenue;
    this.monthRevObj = this.data[0].monthTotal;
    this.revenueCurrency = this.data[0].revenueCurrency;
  }

  public close() {
    this.dialogRef.close();
  }

}
