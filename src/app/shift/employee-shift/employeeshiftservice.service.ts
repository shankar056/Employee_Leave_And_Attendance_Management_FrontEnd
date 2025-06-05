import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeshiftserviceService {
  private baseUrl = 'http://localhost:9090/shifts';

  constructor(private http: HttpClient) {}

  // Helper method to get headers with JWT token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Fetch all shifts for the employee
  getEmployeeShifts(employeeId: number): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/shiftByEmployeeId/${employeeId}`, { headers }).pipe(
      map(response => response.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())), // Sort by date descending
      catchError(error => {
        console.error('Failed to fetch employee shifts', error);
        return throwError(() => new Error('Failed to fetch employee shifts'));
      })
    );
  }

  // Request a shift swap
  requestShiftSwap(shiftId: number): Observable<string> {
    const headers = this.getHeaders();
    return this.http.post(`${this.baseUrl}/requestSwap/${shiftId}`, {}, { headers, responseType: 'text' }).pipe(
      map(response => {
        console.log(`Shift swap request for shift ID ${shiftId} submitted successfully`, response);
        return response;
      }),
      catchError(error => {
        console.error(`Failed to request shift swap for shift ID ${shiftId}`, error);
        return throwError(() => new Error('Failed to request shift swap'));
      })
    );
  }
}