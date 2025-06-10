import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
 
@Injectable({
  providedIn: 'root'
})
export class ManagerswapserviceService {
  private baseUrl = 'http://localhost:9090/shifts';
 
  constructor(private http: HttpClient) {}
 
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
 
  getAllShifts(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/findall`, { headers }).pipe(
      catchError(error => {
        console.error('Failed to fetch shifts', error);
        return throwError(() => new Error('Failed to fetch shifts'));
      })
    );
  }
 
  approveSwapRequest(shiftId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.baseUrl}/approveSwap/${shiftId}`, {}, { headers,responseType: 'text' }).pipe(
      catchError(error => {
        console.error('Failed to approve swap request', error);
        return throwError(() => new Error('Failed to approve swap request'));
      })
    );
  }
 
  rejectSwapRequest(shiftId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.baseUrl}/rejectSwap/${shiftId}`, {}, { headers,responseType: 'text'}).pipe(
      catchError(error => {
        console.error('Failed to reject swap request', error);
        return throwError(() => new Error('Failed to reject swap request'));
      })
    );
  }
 
  // New method for processing swaps
  processSwaps(date: string): Observable<string> {
    const headers = this.getHeaders();
    return this.http.post(`${this.baseUrl}/processSwaps/${date}`, {}, {
      headers,
      responseType: 'text'
    }).pipe(
      catchError(error => {
        console.error('Failed to process swaps', error);
        return throwError(() => new Error('Failed to process swaps'));
      })
    );
  }
}