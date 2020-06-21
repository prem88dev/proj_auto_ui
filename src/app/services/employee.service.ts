import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private httpClient: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      /* Client-side errors */
      errorMessage = `Error: ${error.error.message}`;
    } else {
      /* Server-side errors */
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  public employeeList(esaId: string, revenueYear: string) {
    if (esaId === undefined || esaId === null || esaId === "") {
      alert("ESA ID not provided");
    } else if (revenueYear === undefined || revenueYear === null || revenueYear === "") {
      alert("Revenue year not provided");
    } else {
      const employeeListUrl = "http://localhost:5454/workforce?esaId=" + esaId + "&revenueYear=" + revenueYear;
      return this.httpClient.get(employeeListUrl).pipe(catchError(this.handleError));
    }
  }

  public employeeRevenue(revenueYear: string, employeeFilter: string) {
    if (revenueYear === undefined || revenueYear === null || revenueYear === "") {
      alert("Revenue year not provided");
    } else if (employeeFilter === undefined || employeeFilter === null || employeeFilter === "") {
      alert("Employee filter is not provided");
    } else {
      const employeeRevenueUrl = "http://localhost:5454/employeeRevenue?revenueYear=" + revenueYear + "&employeeFilter=" + employeeFilter;
      return this.httpClient.get(employeeRevenueUrl).pipe(catchError(this.handleError));
    }
  }

  public getMinMaxAllocYear(esaId: string) {
    if (esaId === undefined || esaId === null || esaId === "") {
      alert("ESA ID not provided");
    } else {
      const getMinMaxYearUrl = "http://localhost:5454/minMaxAllocYear?esaId=" + esaId;
      return this.httpClient.get(getMinMaxYearUrl).pipe(catchError(this.handleError));
    }
  }
}
