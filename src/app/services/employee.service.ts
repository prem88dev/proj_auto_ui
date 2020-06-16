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

  public employeeList(esaId: string, esaSubType?: string) {
    let esaSubTypeBuff = "";
    if (esaSubType === undefined || esaSubType === null) {
      esaSubTypeBuff = "";
    }
    const employeeListUrl = "http://localhost:5454/workforce?esaId=" + esaId + "&esaSubType=" + esaSubTypeBuff;
    return this.httpClient.get(employeeListUrl).pipe(catchError(this.handleError));
  }

  public employeeRevenue(filter: string) {
    const employeeRevenueUrl = "http://localhost:5454/employeeRevenue?filter=" + filter;
    return this.httpClient.get(employeeRevenueUrl).pipe(catchError(this.handleError));
  }
}
