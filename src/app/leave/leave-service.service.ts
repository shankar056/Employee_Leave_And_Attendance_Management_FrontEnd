import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LeaveServiceService {
  private baseUrl = 'http://localhost:9090/leaverequest';

  constructor(private http: HttpClient) {}

  // Helper method to get headers with JWT token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Get the token from local storage
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Fetch all leave requests
  getAllLeaves(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/getAll`, { headers }).pipe(
      map(response => {
        console.log('Leave requests fetched successfully', response);
        return response; // Return the response directly
      }),
      catchError(error => {
        console.error('Failed to fetch leave requests', error);
        return throwError(() => new Error('Failed to fetch leave requests'));
      })
    );
  }

  // Approve a leave request
  approveLeave(leaveId: number): Observable<string> {
    const headers = this.getHeaders();
    return this.http.post(`${this.baseUrl}/approve/${leaveId}`, {}, { headers, responseType: 'text' }).pipe(
      map(response => {
        console.log(`Leave request with ID ${leaveId} approved successfully`, response);
        return response; // Return the response as a string
      }),
      catchError(error => {
        console.error(`Failed to approve leave request with ID ${leaveId}`, error);
        return throwError(() => new Error('Failed to approve leave request'));
      })
    );
  }

  // Reject a leave request
  rejectLeave(leaveId: number): Observable<string> {
    const headers = this.getHeaders();
    return this.http.post(`${this.baseUrl}/reject/${leaveId}`, {}, { headers, responseType: 'text' }).pipe(
      map(response => {
        console.log(`Leave request with ID ${leaveId} rejected successfully`, response);
        return response; // Return the response as a string
      }),
      catchError(error => {
        console.error(`Failed to reject leave request with ID ${leaveId}`, error);
        return throwError(() => new Error('Failed to reject leave request'));
      })
    );
  }
}