import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeatendanceComponent } from './employeeatendance/employeeatendance.component';
import { ManageratendanceComponent } from './manageratendance/manageratendance.component';
 
@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, EmployeeatendanceComponent, ManageratendanceComponent],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  userRole: string | null = null;
 
  ngOnInit(): void {
    this.userRole = localStorage.getItem('role');
  }
}
 