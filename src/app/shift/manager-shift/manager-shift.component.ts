import { Component, OnInit } from '@angular/core';
import { ShiftserviceService } from './shiftservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manager-shift',
  imports: [CommonModule,FormsModule],
  templateUrl: './manager-shift.component.html',
  styleUrls: ['./manager-shift.component.css']
})
export class ManagerShiftComponent implements OnInit {
  selectedDate: string = new Date().toISOString().split('T')[0];
  minDate: string = new Date().toISOString().split('T')[0]; // Block past dates
  employees: any[] = [];
  assignedShifts: any[] = [];
  unassignedEmployees: any[] = [];
  unassignedCount: number = 0;
  dayShiftCount: number = 0;
  nightShiftCount: number = 0;

  constructor(private shiftService: ShiftserviceService) {}

  ngOnInit(): void {
    this.fetchEmployees();
    this.fetchShiftsByDate(this.selectedDate);
  }

  fetchEmployees(): void {
    this.shiftService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.updateUnassignedEmployees();
      },
      error: (error) => console.error('Error fetching employees:', error)
    });
  }

  fetchShiftsByDate(date: string): void {
    this.shiftService.getShiftsByDate(date).subscribe({
      next: (data) => {
        this.assignedShifts = data;
        this.updateUnassignedEmployees();
        this.updateShiftCounts();
      },
      error: (error) => console.error('Error fetching shifts by date:', error)
    });
  }

  updateUnassignedEmployees(): void {
    const assignedEmployeeIds = this.assignedShifts.map(shift => shift.employeeId);
    this.unassignedEmployees = this.employees.filter(employee => !assignedEmployeeIds.includes(employee.id));
    this.unassignedCount = this.unassignedEmployees.length;
  }

  updateShiftCounts(): void {
    this.dayShiftCount = this.assignedShifts.filter(shift => shift.shiftType === 'Day').length;
    this.nightShiftCount = this.assignedShifts.filter(shift => shift.shiftType === 'Night').length;
  }

  assignShift(employeeId: number, shiftType: string): void {
    const shiftData = {
      employeeId,
      shiftType,
      swapRequested: false,
      date: this.selectedDate
    };

    this.shiftService.saveShift(shiftData).subscribe({
      next: () => {
        alert(`Shift assigned successfully: ${shiftType}`);
        this.fetchShiftsByDate(this.selectedDate); // Refresh the shifts
      },
      error: (error) => console.error('Error assigning shift:', error)
    });
  }

  onDateChange(): void {
    this.fetchShiftsByDate(this.selectedDate);
  }
}