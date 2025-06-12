import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, user } from '../userservice.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  registrationError: boolean = false;
  registrationSuccess: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.registrationForm = this.fb.group({
      employeeId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    const newUser: user = this.registrationForm.value;

    this.userService.registerUser(newUser).subscribe({
      next: () => {
        this.registrationSuccess = true;
        setTimeout(() => {
          this.router.navigate(['/login']); // Redirect to login page after successful registration
        }, 3000);
      },
      error: () => {
        this.registrationError = true;
        setTimeout(() => {
          this.registrationError = false;
        }, 2000);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/login']); // Navigate back to login page
  }
}