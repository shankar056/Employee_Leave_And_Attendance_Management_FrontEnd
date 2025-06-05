import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService, Attendance } from '../addendanceservice.service';
 
@Component({
  selector: 'app-employeeatendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employeeatendance.component.html',
  styleUrls: ['./employeeatendance.component.css']
})
export class EmployeeatendanceComponent implements OnInit {
  attendanceHistory: Attendance[] = [];
  filteredAttendance: Attendance[] = [];
  isClockedIn = false;
  hasCompletedAttendance = false;
  currentTime = new Date();
  workHours = 0;
  employeeId: number;
  isLoading = false;
  todayRecord: Attendance | null = null;
  searchDate: string;
 
  constructor(private attendanceService: AttendanceService) {
    this.employeeId = Number(localStorage.getItem('userId')) || 0;
    this.searchDate = new Date().toISOString().split('T')[0];
  }
 
  ngOnInit(): void {
    this.loadAttendanceHistory();
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }
 
  clockIn(): void {
    if (this.isLoading || this.isClockedIn || this.hasCompletedAttendance) return;
 
    this.isLoading = true;
    this.attendanceService.clockIn(this.employeeId).subscribe({
      next: () => {
        this.loadAttendanceHistory();
      },
      error: (error) => {
        console.error('Clock in failed:', error);
        alert('Failed to clock in. Please try again.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
 
  clockOut(): void {
    if (!confirm('Are you sure you want to clock out?')) return;
   
    if (this.isLoading || !this.isClockedIn || this.hasCompletedAttendance) return;
 
    this.isLoading = true;
    this.attendanceService.clockOut(this.employeeId).subscribe({
      next: () => {
        this.loadAttendanceHistory();
      },
      error: (error) => {
        console.error('Clock out failed:', error);
        alert('Failed to clock out. Please try again.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
 
  loadAttendanceHistory(): void {
    this.attendanceService.getAttendanceHistory(this.employeeId).subscribe({
      next: (data) => {
        // Sort attendance in descending order by date
        this.attendanceHistory = data.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.filterAttendance();
       
        // Check today's attendance
        const today = new Date().toLocaleDateString();
        this.todayRecord = data.find(record =>
          new Date(record.date).toLocaleDateString() === today
        ) || null;
 
        if (this.todayRecord) {
          if (this.todayRecord.clockOut && this.todayRecord.clockOut !== '-') {
            this.isClockedIn = false;
            this.hasCompletedAttendance = true;
          } else {
            this.isClockedIn = true;
            this.hasCompletedAttendance = false;
          }
        } else {
          this.isClockedIn = false;
          this.hasCompletedAttendance = false;
        }
      },
      error: (error) => {
        console.error('Failed to load attendance history:', error);
        alert('Failed to load attendance history. Please refresh the page.');
      }
    });
  }
 
  filterAttendance(): void {
    if (!this.searchDate) {
      this.filteredAttendance = [...this.attendanceHistory];
    } else {
      const searchDate = new Date(this.searchDate).toLocaleDateString();
      this.filteredAttendance = this.attendanceHistory.filter(record =>
        new Date(record.date).toLocaleDateString() === searchDate
      );
    }
  }
 
  clearSearch(): void {
    this.searchDate = '';
    this.filterAttendance();
  }
 
  getButtonStatus(type: 'clockIn' | 'clockOut'): { disabled: boolean; tooltip: string } {
    if (this.isLoading) {
      return { disabled: true, tooltip: 'Processing...' };
    }
 
    if (this.hasCompletedAttendance) {
      return { disabled: true, tooltip: 'Attendance already completed for today' };
    }
 
    if (type === 'clockIn') {
      return {
        disabled: this.isClockedIn,
        tooltip: this.isClockedIn ? 'Already clocked in' : 'Click to clock in'
      };
    }
 
    return {
      disabled: !this.isClockedIn,
      tooltip: !this.isClockedIn ? 'Must clock in first' : 'Click to clock out'
    };
  }
}