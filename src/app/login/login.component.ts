import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../userservice.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule, ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: boolean = false;

  constructor(private fb: FormBuilder, private router: Router,private userService: UserService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    const { username, password } = this.loginForm.value;
    this.userService.loginUser({ username, password }).subscribe({
      next: (response) => {
        console.log("Login successful", response);
        localStorage.setItem('token', response.token); // Store the token
        localStorage.setItem('username', username); // Store the username
        // Fetch and store the user's role
        this.userService.getUserRole(username).subscribe({
          next: (role) => {
            console.log("User role:", role);
            localStorage.setItem('role', role); // Store the role
            this.router.navigate(['/']).then(()=>{
            window.location.reload(); // Reload the page to apply changes
            }); // Navigate to the landing page
          },
          error: (error) => {
            console.error("Failed to fetch user role", error);
          }
        });
      },
      error: (error) => {
        console.error("Login failed", error);
        this.loginError = true; // Show the error message
      }
    });
  }
}
