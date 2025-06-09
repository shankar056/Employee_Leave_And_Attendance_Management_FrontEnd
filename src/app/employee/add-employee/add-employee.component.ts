import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee } from '../employeeservice.service';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-add-employee',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit, OnChanges {
  @Input() employee: Employee | null = null;
  @Output() formSubmit = new EventEmitter<Employee>();
  @Output() cancel = new EventEmitter<void>();
 
  employeeForm!: FormGroup;
  isEmployee = localStorage.getItem('role') === 'Employee';
  formError: boolean = false;
  formSuccess: boolean = false;
 
  constructor(private fb: FormBuilder) {}
 
  ngOnInit(): void {
    this.initializeForm();
    if (this.employee) {
      this.employeeForm.patchValue(this.employee);
    }
  }
 
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee'] && this.employeeForm && this.employee) {
      this.employeeForm.patchValue(this.employee);
    }
  }
 
  initializeForm(): void {
    this.employeeForm = this.fb.group({
      id: [{ value: null, disabled: true }],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [{
        value: 'Employee',
        disabled: this.isEmployee
      }, [Validators.required]],
      department: ['', [Validators.required]],
      contact: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }
 
  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.formError = false;
      const employeeData: Employee = {
        ...this.employeeForm.getRawValue(),
        id: this.employee?.id || null
      };
     
      this.formSuccess = true;
      setTimeout(() => {
        this.formSubmit.emit(employeeData);
        this.employeeForm.reset();
        this.formSuccess = false;
      }, 1500);
    } else {
      this.formError = true;
      this.formSuccess = false;
      setTimeout(() => {
        this.formError = false;
      }, 3000);
    }
  }
 
  onCancel(): void {
    this.employeeForm.reset();
    this.formError = false;
    this.formSuccess = false;
    this.cancel.emit();
  }
}
 