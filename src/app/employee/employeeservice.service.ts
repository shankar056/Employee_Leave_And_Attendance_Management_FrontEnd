import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeserviceService {
  private employees: Employee[] = [];
  private baseUrl = 'http://localhost:9090/employees';

  constructor(private httpClient: HttpClient) {
    this.fetchEmployees();
  }

  // Fetch employees from the server with JWT token
  private fetchEmployees(): void {
    const token = localStorage.getItem('token'); // Get the token from local storage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Add the token to headers

    this.httpClient.get<Employee[]>(`${this.baseUrl}/findAllEmployee`, { headers })
      .pipe(
        map(response => {
          console.log("Employees fetched successfully", response);
          this.employees = response;
          return response;
        }),
        catchError(error => {
          console.error("Failed to fetch employees", error);
          return throwError(() => new Error('Failed to fetch employees'));
        })
      ).subscribe();
  }
  getEmployeesFromBackend(): Observable<Employee[]> {
    const token = localStorage.getItem('token'); // Get the token from local storage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Add the token to headers
  
    return this.httpClient.get<Employee[]>(`${this.baseUrl}/findAllEmployee`, { headers }).pipe(
      map(response => {
        console.log('Employees fetched successfully', response);
        this.employees = response; // Update the local list
        return response;
      }),
      catchError(error => {
        console.error('Failed to fetch employees', error);
        return throwError(() => new Error('Failed to fetch employees'));
      })
    );
  }
  // Add a new employee
  addEmployee(employee: Employee): Observable<Employee> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.httpClient.post<Employee>(`${this.baseUrl}/save`, employee, { headers })
      .pipe(
        map(response => {
          console.log("Employee added successfully", response);
          this.employees.push(response); // Update the local list
          return response;
        }),
        catchError(error => {
          console.error("Failed to add employee", error);
          return throwError(() => new Error('Failed to add employee'));
        })
      );
  }

  // Get the list of employees
  getEmployees(): Employee[] {
    return this.employees;
  }

  // Update an existing employee
  updateEmployee(employee: Employee): Observable<Employee> {
    if (!employee.id) {
      console.error('Employee ID is undefined. Cannot update employee.');
      return throwError(() => new Error('Employee ID is undefined.'));
    }
  
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.httpClient.put<Employee>(`${this.baseUrl}/updateEmployee/${employee.id}`, employee, { headers })
      .pipe(
        map(response => {
          console.log("Employee updated successfully", response);
          const index = this.employees.findIndex(e => e.id === employee.id);
          if (index !== -1) {
            this.employees[index] = response; // Update the local list
          }
          return response;
        }),
        catchError(error => {
          console.error("Failed to update employee", error);
          return throwError(() => new Error('Failed to update employee'));
        })
      );
  }

  // Delete an employee
  deleteEmployee(id: number): Observable<void> {
    if (!id) {
      console.error('Employee ID is undefined. Cannot delete employee.');
      return throwError(() => new Error('Employee ID is undefined.'));
    }
  
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.httpClient.delete<void>(`${this.baseUrl}/deleteEmployee/${id}`, { headers, responseType: 'text' as 'json' })
      .pipe(
        map(() => {
          console.log("Employee deleted successfully");
          this.employees = this.employees.filter(e => e.id !== id); // Update the local list
        }),
        catchError(error => {
          console.error("Failed to delete employee", error);
          return throwError(() => new Error('Failed to delete employee'));
        })
      );
  }
}

export class Employee {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public password: string,
    public role: string,
    public department: string,
    public contactno: string
  ) {}
} 