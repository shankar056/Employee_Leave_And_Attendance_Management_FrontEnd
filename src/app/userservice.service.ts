import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService{
 
  constructor(private httpClient: HttpClient) { }
  path= "http://localhost:9090/auth/new";
 
  public registerUser(user: user): Observable<user> {
    console.log("UserService: Registering user", user);
    return this.httpClient.post(this.path, user,{
      responseType:'text'
    }).pipe(
      map(response => {
        console.log(response);
        return user; // Return the user object or any other relevant data
      }),
      catchError(error => {
        console.error("Registration failed", error);
        return throwError(() => new Error('Registration failed'));
      })
    );
  }
  public loginUser(login: login): Observable<any> {
    console.log("UserService: Logging in user", login);
    return this.httpClient.post("http://localhost:9090/auth/authenticate", login, {
      responseType: 'text' // 👈 This tells Angular to treat the response as plain text
    }).pipe(
      map(response => {
        console.log("Login successful", response);
        return { token: response }; // Wrap the token in an object if needed
      }),
      catchError(error => {
        console.error("Login failed", error);
        return throwError(() => new Error('Login failed'));
      })
    );
  }
  public getUserRole(username: string): Observable<any> {
    const url = `http://localhost:9090/auth/getroles/${username}`;
    return this.httpClient.get(url, { responseType: 'text' }).pipe(
      map(response => {
        console.log("User role fetched successfully:", response);
        return response; // Return the plain text response
      }),
      catchError(error => {
        console.error("Failed to fetch user role", error);
        return throwError(() => new Error('Failed to fetch user role'));
      })
    );
  }
  public getUserId(username: string): Observable<number> {
    const url = `http://localhost:9090/auth/getemployeeid/${username}`;
    return this.httpClient.get(url, { responseType: 'text' }).pipe(
      map(response => {
        console.log("User ID fetched successfully:", response);
        return parseInt(response, 10); // Convert the response to a number
      }),
      catchError(error => {
        console.error("Failed to fetch User ID", error);
        return throwError(() => new Error('Failed to fetch User ID'));
      })
    );
  }
}
export class login{
  username?: string;
  password?: string;
}
export class user{
  employeeId?: number;
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}