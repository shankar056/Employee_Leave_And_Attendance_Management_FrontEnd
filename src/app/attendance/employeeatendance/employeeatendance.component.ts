import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService, Attendance } from '../addendanceservice.service';

@Component({
  selector: 'app-employeeatendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employeeatendance.component.html',
  styleUrls: ['./employeeatendance.component.css']
})
export class EmployeeatendanceComponent implements OnInit {
  attendanceHistory: Attendance[] = [];
  isClockedIn = false;
  currentTime = new Date();
  workHours = 0;
  employeeId: number;

  constructor(private attendanceService: AttendanceService) {
    this.employeeId = Number(localStorage.getItem('userId')) || 0;
  }

  ngOnInit(): void {
    this.loadAttendanceHistory();
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  clockIn(): void {
    this.attendanceService.clockIn(this.employeeId).subscribe({
      next: () => {
        this.isClockedIn = true;
        this.loadAttendanceHistory();
      },
      error: (error) => console.error('Clock in failed:', error)
    });
  }

  clockOut(): void {
    this.attendanceService.clockOut(this.employeeId).subscribe({
      next: () => {
        this.isClockedIn = false;
        this.loadAttendanceHistory();
      },
      error: (error) => console.error('Clock out failed:', error)
    });
  }

  loadAttendanceHistory(): void {
    this.attendanceService.getAttendanceHistory(this.employeeId).subscribe({
      next: (data) => {
        this.attendanceHistory = data;
        // Check if currently clocked in
        const today = new Date().toLocaleDateString();
        const todayRecord = data.find(record => record.date === today);
        this.isClockedIn = !!(todayRecord && !todayRecord.clockOut);
      },
      error: (error) => console.error('Failed to load attendance history:', error)
    });
  }
}