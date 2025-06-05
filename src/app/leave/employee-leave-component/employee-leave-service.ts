import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeLeaveComponentService {
  private baseUrl = 'http://localhost:9090';

  constructor(private http: HttpClient) {}

  // Helper method to get headers with JWT token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Fetch leave balance for the employee
  getLeaveBalance(employeeId: number): Observable<any[]> {
    const headers = this.getHeaders();
    const url = `${this.baseUrl}/leavebalance/employee/${employeeId}`;
    return this.http.get<any[]>(url, { headers }).pipe(
      map(response => response), // Map the response directly
      catchError(error => {
        console.error('Failed to fetch leave balance', error);
        return throwError(() => new Error('Failed to fetch leave balance'));
      })
    );
  }

  // Apply for leave
  applyLeave(leaveRequest: any): Observable<string> {
    const headers = this.getHeaders();
    return this.http.post(`${this.baseUrl}/leaverequest/apply`, leaveRequest, { headers, responseType: 'text' }).pipe(
      map(response => response),
      catchError(error => {
        console.error('Failed to apply for leave', error);
        return throwError(() => new Error('Failed to apply for leave'));
      })
    );
  }

  // Fetch leave history
  getLeaveHistory(employeeId: number): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/leaverequest/employee/${employeeId}`, { headers }).pipe(
      map(response => response),
      catchError(error => {
        console.error('Failed to fetch leave history', error);
        return throwError(() => new Error('Failed to fetch leave history'));
      })
    );
  }

  // Delete leave request
  deleteLeave(leaveId: number): Observable<string> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.baseUrl}/leaverequest/delete/${leaveId}`, { headers, responseType: 'text' }).pipe(
      map(response => response),
      catchError(error => {
        console.error('Failed to delete leave request', error);
        return throwError(() => new Error('Failed to delete leave request'));
      })
    );
  }
}