import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard-detailview',
  templateUrl: './dashboard-detailview.component.html',
  styleUrls: ['./dashboard-detailview.component.css'],
  providers: [DashboardDetailviewComponent]
})
export class DashboardDetailviewComponent {

  constructor(
    private matDialog: MatDialog,
    private dialogRef: MatDialogRef<DashboardDetailviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  public close() {
    this.dialogRef.close();
  }
}