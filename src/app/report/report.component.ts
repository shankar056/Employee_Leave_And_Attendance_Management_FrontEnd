import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeereportComponent } from './employeereport/employeereport.component';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule, EmployeereportComponent],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit {
  userRole: string | null = null;
  selectedEmployeeId: number | null = null;
  employeeIdInput: string = '';

  ngOnInit() {
    this.userRole = localStorage.getItem('role');
    if (this.userRole === 'Employee') {
      this.selectedEmployeeId = Number(localStorage.getItem('userId'));
    }
  }

  generateReport() {
    if (this.employeeIdInput) {
      this.selectedEmployeeId = Number(this.employeeIdInput);
      localStorage.setItem('selectedEmployeeId', this.employeeIdInput);
    }
  }
}