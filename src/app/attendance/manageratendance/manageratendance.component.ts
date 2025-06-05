import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService, Attendance } from '../addendanceservice.service';
 
@Component({
  selector: 'app-manageratendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manageratendance.component.html',
  styleUrls: ['./manageratendance.component.css']
})
export class ManageratendanceComponent implements OnInit {
  attendanceList: Attendance[] = [];
  filteredAttendance: Attendance[] = [];
  searchDate: string = '';
  searchEmployee: string = '';
  stats: any = {
    totalEmployees: 0,
    clockedInCount: 0,
    clockedOutCount: 0
  };
  isLoading = true;
 
  constructor(private attendanceService: AttendanceService) {
    this.searchDate = new Date().toISOString().split('T')[0];
  }
 
  ngOnInit(): void {
    this.loadAttendanceData();
  }
 
  loadAttendanceData(): void {
    this.isLoading = true;
    this.attendanceService.getDailyAttendanceStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loadAllAttendance();
      },
      error: (error) => {
        console.error('Failed to load stats:', error);
        this.isLoading = false;
      }
    });
  }
 
  loadAllAttendance(): void {
    this.attendanceService.getAllAttendance().subscribe({
      next: (data) => {
        this.attendanceList = data.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.filterAttendance();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load attendance:', error);
        this.isLoading = false;
      }
    });
  }
 
  filterAttendance(): void {
    let filtered = [...this.attendanceList];
 
    if (this.searchDate) {
      const searchDate = new Date(this.searchDate).toLocaleDateString();
      filtered = filtered.filter(record => record.date === searchDate);
    }
 
    if (this.searchEmployee) {
      const search = this.searchEmployee.toLowerCase();
      filtered = filtered.filter(record =>
        record.employeeId.toString().includes(search)
      );
    }
 
    this.filteredAttendance = filtered;
  }
 
  clearSearch(): void {
    this.searchDate = '';
    this.searchEmployee = '';
    this.filterAttendance();
  }
}
 