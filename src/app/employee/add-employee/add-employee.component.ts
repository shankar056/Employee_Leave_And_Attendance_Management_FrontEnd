import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee } from '../employeeservice.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-employee',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit, OnChanges {
  @Input() employee: Employee | null = null; // Input for the employee to edit
  @Output() formSubmit = new EventEmitter<Employee>(); // Output to notify parent
  @Output() cancel = new EventEmitter<void>(); // Output to notify parent when cancel is clicked
  employeeForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    if (this.employee) {
      this.employeeForm.patchValue(this.employee); // Pre-fill the form
      console.log('Editing employee:', this.employee);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee'] && this.employeeForm && this.employee) {
      this.employeeForm.patchValue(this.employee); // Update the form when the input changes
    }
  }

  initializeForm(): void {
    this.employeeForm = this.fb.group({
      id: [{ value: null, disabled: true }], // Disabled field for id (read-only)
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['Employee', [Validators.required]],
      department: ['', [Validators.required]],
      contactno: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }
  
  onSubmit(): void {
    if (this.employeeForm.valid) {
      const employeeData: Employee = {
        ...this.employeeForm.getRawValue(), // Get all form values, including disabled fields
        id: this.employee?.id || null // Ensure id is included for updates
      };
      this.formSubmit.emit(employeeData); // Emit the updated or new employee
      this.employeeForm.reset(); // Reset the form after submission
    } else {
      console.log('Form is invalid');
    }
  }

  onCancel(): void {
    this.employeeForm.reset(); // Reset the form
    this.cancel.emit(); // Notify the parent component
  }
}