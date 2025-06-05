import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShiftserviceService {
  private baseUrl = 'http://localhost:9090';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Fetch all employees
  getAllEmployees(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/employees/findAllEmployee`, { headers }).pipe(
      catchError(error => {
        console.error('Failed to fetch employees', error);
        return throwError(() => new Error('Failed to fetch employees'));
      })
    );
  }

  // Fetch shifts assigned for a specific date
  getShiftsByDate(date: string): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/shifts/byDate/${date}`, { headers }).pipe(
      catchError(error => {
        console.error('Failed to fetch shifts by date', error);
        return throwError(() => new Error('Failed to fetch shifts by date'));
      })
    );
  }

  // Save a shift
  saveShift(shiftData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.baseUrl}/shifts/save`, shiftData, { headers }).pipe(
      catchError(error => {
        console.error('Failed to save shift', error);
        return throwError(() => new Error('Failed to save shift'));
      })
    );
  }
}