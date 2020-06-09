import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Project } from '../models/project'

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
    const listProjUrl = "http://localhost:5454/projectList";
    return this.httpClient.get<Project[]>(listProjUrl).pipe(catchError(this.handleError));
  }

  public projectRevenue(esaId: string, revenueYear: string) {
    const getProjRevUrl = "http://localhost:5454/projectRevenue?esaId=" + esaId + "&revenueYear=" + revenueYear;
    console.log(getProjRevUrl);
    return this.httpClient.get(getProjRevUrl).pipe(catchError(this.handleError));
  }

  
}