// import { Component, OnInit } from '@angular/core';
// import { EmployeeLeaveComponentService } from './employee-leave-service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-employee-leave-component',
//   imports: [CommonModule,FormsModule],
//   templateUrl: './employee-leave-component.component.html',
//   styleUrls: ['./employee-leave-component.component.css']
// })
// export class EmployeeLeaveComponentComponent implements OnInit {
//   leaveBalances: any[] = [];
//   leaveHistory: any[] = [];
//   leaveRequest: any = {
//     employeeId: null,
//     leaveType: '',
//     startDate: '',
//     endDate: ''
//   };
//   errorMessage: string | null = null;

//   constructor(private leaveService: EmployeeLeaveComponentService) {}

//   ngOnInit(): void {
//     const employeeId = localStorage.getItem('userId');
//     if (employeeId) {
//       this.leaveRequest.employeeId = parseInt(employeeId, 10);
//       this.fetchLeaveBalance(this.leaveRequest.employeeId);
//       this.fetchLeaveHistory(this.leaveRequest.employeeId);
//     }
//   }

//   fetchLeaveBalance(employeeId: number): void {
//     this.leaveService.getLeaveBalance(employeeId).subscribe((data) => {
//       // Map the backend response to the leaveBalances array
//       this.leaveBalances = data.map((item: any) => ({
//         type: item.leaveType,
//         remaining: item.balance // Use the "balance" field from the backend response
//       }));
//     });
//   }

//   fetchLeaveHistory(employeeId: number): void {
//     this.leaveService.getLeaveHistory(employeeId).subscribe((data) => {
//       this.leaveHistory = data;
//     });
//   }

//   applyForLeave(): void {
//     const today = new Date().toISOString().split('T')[0];
//     if (this.leaveRequest.startDate <= today || this.leaveRequest.endDate <= today) {
//       this.errorMessage = 'Dates must be in the future.';
//       return;
//     }
//     if (this.leaveRequest.startDate > this.leaveRequest.endDate) {
//       this.errorMessage = 'End date must be greater than start date.';
//       return;
//     }
//     const balance = this.leaveBalances.find((b) => b.type === this.leaveRequest.leaveType);
//     if (!balance) {
//       this.errorMessage = 'Invalid leave type.';
//       return;
//     }
//     const days = this.calculateDays(this.leaveRequest.startDate, this.leaveRequest.endDate);
//     if (days > balance.remaining) {
//       this.errorMessage = 'Insufficient leave balance.';
//       return;
//     }
//     this.leaveService.applyLeave(this.leaveRequest).subscribe(() => {
//       this.errorMessage = null;
//       this.fetchLeaveHistory(this.leaveRequest.employeeId!);
//       this.fetchLeaveBalance(this.leaveRequest.employeeId!); // Refresh leave balance
//     });
//   }

//   deleteLeave(leaveId: number): void {
//     this.leaveService.deleteLeave(leaveId).subscribe(() => {
//       this.fetchLeaveHistory(this.leaveRequest.employeeId!);
//     });
//   }

//   calculateDays(startDate: string, endDate: string): number {
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
//   }
// }
import { Component, OnInit } from '@angular/core';
import { EmployeeLeaveComponentService } from './employee-leave-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-leave-component',
  imports: [CommonModule,FormsModule],
  templateUrl: './employee-leave-component.component.html',
  styleUrls: ['./employee-leave-component.component.css']
})
export class EmployeeLeaveComponentComponent implements OnInit {
  leaveBalances: any[] = [];
  leaveHistory: any[] = [];
  filteredLeaveHistory: any[] = [];
  leaveRequest: any = {
    employeeId: null,
    leaveType: '',
    startDate: '',
    endDate: ''
  };
  searchFilters: any = {
    leaveType: '',
    status: '',
    startDate: ''
  };
  errorMessage: string | null = null;

  constructor(private leaveService: EmployeeLeaveComponentService) {}

  ngOnInit(): void {
    const employeeId = localStorage.getItem('userId');
    if (employeeId) {
      this.leaveRequest.employeeId = parseInt(employeeId, 10);
      this.fetchLeaveBalance(this.leaveRequest.employeeId);
      this.fetchLeaveHistory(this.leaveRequest.employeeId);
    }
  }

  fetchLeaveBalance(employeeId: number): void {
    this.leaveService.getLeaveBalance(employeeId).subscribe((data) => {
      this.leaveBalances = data.map((item: any) => ({
        type: item.leaveType,
        remaining: item.balance
      }));
    });
  }

  fetchLeaveHistory(employeeId: number): void {
    this.leaveService.getLeaveHistory(employeeId).subscribe((data) => {
      this.leaveHistory = data;
      this.filteredLeaveHistory = [...this.leaveHistory]; // Initialize filtered history
    });
  }

  applyFilters(): void {
    this.filteredLeaveHistory = this.leaveHistory.filter((leave) => {
      const matchesLeaveType = this.searchFilters.leaveType
        ? leave.leaveType === this.searchFilters.leaveType
        : true;
      const matchesStatus = this.searchFilters.status
        ? leave.status === this.searchFilters.status
        : true;
      const matchesStartDate = this.searchFilters.startDate
        ? new Date(leave.startDate).toISOString().split('T')[0] === this.searchFilters.startDate
        : true;

      return matchesLeaveType && matchesStatus && matchesStartDate;
    });
  }

  applyForLeave(): void {
    const today = new Date().toISOString().split('T')[0];
    if (this.leaveRequest.startDate <= today || this.leaveRequest.endDate <= today) {
      this.errorMessage = 'Dates must be in the future.';
      return;
    }
    if (this.leaveRequest.startDate > this.leaveRequest.endDate) {
      this.errorMessage = 'End date must be greater than start date.';
      return;
    }
    const balance = this.leaveBalances.find((b) => b.type === this.leaveRequest.leaveType);
    if (!balance) {
      this.errorMessage = 'Invalid leave type.';
      return;
    }
    const days = this.calculateDays(this.leaveRequest.startDate, this.leaveRequest.endDate);
    if (days > balance.remaining) {
      this.errorMessage = 'Insufficient leave balance.';
      return;
    }
    this.leaveService.applyLeave(this.leaveRequest).subscribe(() => {
      this.errorMessage = null;
      this.fetchLeaveHistory(this.leaveRequest.employeeId!);
      this.fetchLeaveBalance(this.leaveRequest.employeeId!); // Refresh leave balance
    });
  }

  calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  deleteLeave(leaveId: number): void {
    this.leaveService.deleteLeave(leaveId).subscribe(() => {
      this.fetchLeaveHistory(this.leaveRequest.employeeId!);
    });
  }
}