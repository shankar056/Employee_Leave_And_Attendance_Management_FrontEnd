import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, throwError } from 'rxjs';
 
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
  private employeeUrl= 'http://localhost:9090/employees';
  constructor(private http: HttpClient) { }
 
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
  getAllAttendance(): Observable<Attendance[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
   
    return this.http.get<Attendance[]>(`${this.baseUrl}/getall`, { headers }).pipe(
      map(attendance => attendance.map(record => ({
        ...record,
        date: new Date(record.date).toLocaleDateString(),
        clockIn: new Date(record.clockIn).toLocaleTimeString(),
        clockOut: record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : '-'
      }))),
      catchError(error => {
        console.error('Failed to fetch all attendance:', error);
        return throwError(() => new Error('Failed to fetch all attendance'));
      })
    );
  }
  getEmployeeCount(): Observable<number> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
   
    return this.http.get<number>(`${this.employeeUrl}/count`, { headers }).pipe(
      catchError(error => {
        console.error('Failed to fetch employee count:', error);
        return throwError(() => new Error('Failed to fetch employee count'));
      })
    );
  }
  getDailyAttendanceStats(): Observable<any> {
    return forkJoin({
      totalEmployees: this.getEmployeeCount(),
      allAttendance: this.getAllAttendance()
    }).pipe(
      map(({ totalEmployees, allAttendance }) => {
        const today = new Date().toLocaleDateString();
        const todayAttendance = allAttendance.filter(record => record.date === today);
       
        return {
          totalEmployees,
          clockedInCount: todayAttendance.length,
          clockedOutCount: todayAttendance.filter(record => record.clockOut !== '-').length
        };
      })
    );
  }
 
  getAttendanceHistory(employeeId: number): Observable<Attendance[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
   
    return this.http.get<Attendance[]>(`${this.baseUrl}/history?employeeId=${employeeId}`, { headers }).pipe(
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
 