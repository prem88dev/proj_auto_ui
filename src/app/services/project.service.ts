import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

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

  public projectList() {
    const listProjectUrl = "http://localhost:5454/projectList";
    return this.httpClient.get(listProjectUrl).pipe(catchError(this.handleError));
  }

  public projectRevenue(esaId: string, revenueYear: string) {
    const projectRevenueUrl = "http://localhost:5454/projectRevenue?esaId=" + esaId + "&revenueYear=" + revenueYear;
    return this.httpClient.get(projectRevenueUrl).pipe(catchError(this.handleError));
  }
}