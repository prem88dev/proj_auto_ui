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

  public listAllEmployees() {
    const allEmpListUrl = "http://localhost:5454/workforce";
    return this.httpClient.get(allEmpListUrl).pipe(catchError(this.handleError));
  }

  public listProjectEmployees(esaId?: string, revenueYear?: string) {
    const employeeListUrl = "http://localhost:5454/workforce?esaId=" + esaId + "&revenueYear=" + revenueYear;
    console.log(employeeListUrl);
    return this.httpClient.get(employeeListUrl).pipe(catchError(this.handleError));
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
      const getAllProjMinMaxYearUrl = "http://localhost:5454/minMaxAllocYear";
      return this.httpClient.get(getAllProjMinMaxYearUrl).pipe(catchError(this.handleError));
    } else {
      const getMinMaxYearUrl = "http://localhost:5454/minMaxAllocYear?esaId=" + esaId;
      return this.httpClient.get(getMinMaxYearUrl).pipe(catchError(this.handleError));
    }
  }
}