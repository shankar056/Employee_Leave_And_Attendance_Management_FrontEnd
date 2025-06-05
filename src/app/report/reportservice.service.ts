import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportserviceService {
  private apiUrl = 'http://localhost:9090/report';

  constructor(private http: HttpClient) { }

  // Helper method to get headers with JWT token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Get report for specific employee
  getEmployeeReport(employeeId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/${employeeId}`, { headers }).pipe(
      map(response => {
        console.log(`Report fetched successfully for employee ID ${employeeId}`, response);
        return response;
      }),
      catchError(error => {
        console.error(`Failed to fetch report for employee ID ${employeeId}`, error);
        return throwError(() => new Error('Failed to fetch employee report'));
      })
    );
  }
}