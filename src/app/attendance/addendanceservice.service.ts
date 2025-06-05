import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

export interface Attendance {
  id?: number;
  employeeId: number;
  date: string;
  clockIn: string;
  clockOut: string;
  workHours: number;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private baseUrl = 'http://localhost:9090/attendance';
  private clockInUrl = 'http://localhost:9090/attendance';

  constructor(private http: HttpClient) { }
 //http://localhost:9090/attendance/clockin?employeeId=2 this is the URL for clocking in
  //http://localhost:9090/attendance/clockout?employeeId=2 this is the URL for clocking out
  clockIn(employeeId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.post(`${this.baseUrl}/clockin?employeeId=${employeeId}`, {}, { headers }).pipe(
      catchError(error => {
        console.error('Clock in failed:', error);
        return throwError(() => new Error('Failed to clock in'));
      })
    );
  }

  clockOut(employeeId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.post(`${this.baseUrl}/clockout?employeeId=${employeeId}`, {}, { headers }).pipe(
      catchError(error => {
        console.error('Clock out failed:', error);
        return throwError(() => new Error('Failed to clock out'));
      })
    );
  }

  getAttendanceHistory(employeeId: number): Observable<Attendance[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<Attendance[]>(`${this.baseUrl}/employee/${employeeId}`, { headers }).pipe(
      map(attendance => attendance.map(record => ({
        ...record,
        date: new Date(record.date).toLocaleDateString(),
        clockIn: new Date(record.clockIn).toLocaleTimeString(),
        clockOut: record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : '-'
      }))),
      catchError(error => {
        console.error('Failed to fetch attendance history:', error);
        return throwError(() => new Error('Failed to fetch attendance history'));
      })
    );
  }
}