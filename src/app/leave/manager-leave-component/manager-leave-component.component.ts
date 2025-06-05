import { Component, OnInit } from '@angular/core';
import { LeaveServiceService } from '../leave-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manager-leave-component',
  imports: [CommonModule,FormsModule],
  templateUrl: './manager-leave-component.component.html',
  styleUrls: ['./manager-leave-component.component.css']
})
export class ManagerLeaveComponentComponent implements OnInit {
  leaves: any[] = [];
  filteredLeaves: any[] = [];
  approvedCount = 0;
  pendingCount = 0;
  rejectedCount = 0;

  filters = {
    startDate: '',
    employeeId: '',
    leaveType: '',
    status: ''
  };

  constructor(private leaveService: LeaveServiceService) {}

  ngOnInit(): void {
    this.fetchLeaves();
  }

  fetchLeaves(): void {
    this.leaveService.getAllLeaves().subscribe((data) => {
      this.leaves = data;
      this.filteredLeaves = [...this.leaves]; // Initialize filtered leaves
      this.updateCounts();
    });
  }

  updateCounts(): void {
    this.approvedCount = this.leaves.filter((leave) => leave.status === 'Approved').length;
    this.pendingCount = this.leaves.filter((leave) => leave.status === 'Pending').length;
    this.rejectedCount = this.leaves.filter((leave) => leave.status === 'Rejected').length;
  }

  calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  approveLeave(leaveId: number): void {
    this.leaveService.approveLeave(leaveId).subscribe(() => {
      this.fetchLeaves();
    });
  }

  rejectLeave(leaveId: number): void {
    this.leaveService.rejectLeave(leaveId).subscribe(() => {
      this.fetchLeaves();
    });
  }

  applyFilters(): void {
    this.filteredLeaves = this.leaves.filter((leave) => {
      const matchesStartDate = this.filters.startDate
        ? new Date(leave.startDate).toISOString().split('T')[0] === this.filters.startDate
        : true;
      const matchesEmployeeId = this.filters.employeeId
        ? leave.employeeId.toString().includes(this.filters.employeeId)
        : true;
      const matchesLeaveType = this.filters.leaveType
        ? leave.leaveType === this.filters.leaveType
        : true;
      const matchesStatus = this.filters.status
        ? leave.status === this.filters.status
        : true;

      return matchesStartDate && matchesEmployeeId && matchesLeaveType && matchesStatus;
    });
  }
}