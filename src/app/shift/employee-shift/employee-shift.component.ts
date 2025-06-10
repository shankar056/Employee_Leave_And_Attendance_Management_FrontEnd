import { Component, OnInit } from '@angular/core';
import { EmployeeshiftserviceService } from './employeeshiftservice.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
@Component({
  selector: 'app-employee-shift',
  imports: [DatePipe, CommonModule, FormsModule],
  templateUrl: './employee-shift.component.html',
  styleUrls: ['./employee-shift.component.css']
})
export class EmployeeShiftComponent implements OnInit {
  shifts: any[] = [];
  filteredShifts: any[] = [];
  searchDate: string = '';
  errorMessage: string | null = null;
 
  constructor(private shiftService: EmployeeshiftserviceService) {}
 
  ngOnInit(): void {
    const employeeId = parseInt(localStorage.getItem('userId') || '0', 10);
    if (employeeId) {
      this.fetchEmployeeShifts(employeeId);
    }
  }
 
  fetchEmployeeShifts(employeeId: number): void {
    this.shiftService.getEmployeeShifts(employeeId).subscribe({
      next: (data) => {
        this.shifts = data;
        this.filteredShifts = [...this.shifts];
      },
      error: (error) => {
        console.error('Error fetching employee shifts:', error);
        this.errorMessage = 'Failed to fetch shifts. Please try again later.';
      }
    });
  }
 
  applySearch(): void {
    if (this.searchDate) {
      this.filteredShifts = this.shifts.filter(shift => shift.date === this.searchDate);
    } else {
      this.filteredShifts = [...this.shifts];
    }
  }
 
  // Check if shift date is in the past
  isShiftDatePast(shiftDate: string): boolean {
    const today = new Date();
    const shift = new Date(shiftDate);
   
    today.setHours(0, 0, 0, 0);
    shift.setHours(0, 0, 0, 0);
   
    return shift < today;
  }
 
  // Get button text based on shift status
  getButtonText(shift: any): string {
    if (this.isShiftDatePast(shift.date)) {
      return 'Completed';
    } else if (shift.swapRequested) {
      return 'Swap Requested';
    } else {
      return 'Request Swap';
    }
  }
 
  // Get button class based on shift status
  getButtonClass(shift: any): string {
    if (this.isShiftDatePast(shift.date)) {
      return 'btn-secondary';
    } else if (shift.swapRequested) {
      return 'btn-success';
    } else {
      return 'btn-primary';
    }
  }
 
  // Get button icon based on shift status
  getButtonIcon(shift: any): string {
    if (this.isShiftDatePast(shift.date)) {
      return 'fa-check-circle';
    } else if (shift.swapRequested) {
      return 'fa-clock';
    } else {
      return 'fa-exchange-alt';
    }
  }
 
  // Check if button should be disabled
  isButtonDisabled(shift: any): boolean {
    return this.isShiftDatePast(shift.date) || shift.swapRequested;
  }
 
  requestSwap(shiftId: number): void {
    const shift = this.shifts.find(s => s.id === shiftId);
    if (shift && this.isShiftDatePast(shift.date)) {
      alert('Cannot request swap for past shift dates.');
      return;
    }
 
    this.shiftService.requestShiftSwap(shiftId).subscribe({
      next: () => {
        alert('Shift swap request submitted successfully.');
        this.fetchEmployeeShifts(parseInt(localStorage.getItem('userId') || '0', 10));
      },
      error: (error) => {
        console.error('Error requesting shift swap:', error);
        alert('Failed to request shift swap. Please try again later.');
      }
    }); 
  }
}