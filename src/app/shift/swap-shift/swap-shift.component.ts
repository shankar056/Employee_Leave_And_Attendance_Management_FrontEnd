import { Component, OnInit } from '@angular/core';
import { ManagerswapserviceService } from './managerswapservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
@Component({
  selector: 'app-swap-shift',
  imports: [CommonModule, FormsModule],
  templateUrl: './swap-shift.component.html',
  styleUrls: ['./swap-shift.component.css']
})
export class SwapShiftComponent implements OnInit {
  selectedDate: string = new Date().toISOString().split('T')[0];
  shifts: any[] = [];
  filteredShifts: any[] = [];
  processDate: string = new Date().toISOString().split('T')[0];
  searchFilters = {
    employeeId: '',
    date: new Date().toISOString().split('T')[0], // Set default to today's date
    shiftType: ''
  };
  shiftCounts = {
    dayShifts: 0,
    nightShifts: 0,
    swapRequests: 0
  };
 
  constructor(private swapService: ManagerswapserviceService) {}
 
  ngOnInit(): void {
    this.fetchAllShifts();
  }
 
  fetchAllShifts(): void {
    this.swapService.getAllShifts().subscribe({
      next: (data) => {
        this.shifts = data;
        this.applyFilters(); // Apply filters immediately to show today's data
        this.updateShiftCounts();
      },
      error: (error) => console.error('Error fetching shifts:', error)
    });
  }
 
  updateShiftCounts(): void {
    const filteredByDate = this.shifts.filter(shift => shift.date === this.selectedDate);
    this.shiftCounts = {
      dayShifts: filteredByDate.filter(shift => shift.shiftType === 'Day').length,
      nightShifts: filteredByDate.filter(shift => shift.shiftType === 'Night').length,
      swapRequests: filteredByDate.filter(shift => shift.swapRequested).length
    };
  }
 
  applyFilters(): void {
    this.filteredShifts = this.shifts.filter(shift => {
      const matchesEmployeeId = !this.searchFilters.employeeId ||
        shift.employeeId.toString() === this.searchFilters.employeeId;
      const matchesDate = !this.searchFilters.date ||
        shift.date === this.searchFilters.date;
      const matchesType = !this.searchFilters.shiftType ||
        shift.shiftType === this.searchFilters.shiftType;
      return matchesEmployeeId && matchesDate && matchesType;
    });
  }
 
  // Get shift status based on date
  getShiftStatus(shiftDate: string): string {
    const today = new Date();
    const shift = new Date(shiftDate);
   
    // Set time to 00:00:00 for accurate date comparison
    today.setHours(0, 0, 0, 0);
    shift.setHours(0, 0, 0, 0);
   
    if (shift < today) {
      return 'Completed';
    } else if (shift > today) {
      return 'Scheduled';
    } else {
      return 'Active';
    }
  }
 
  // Get badge class based on shift status
  getStatusBadgeClass(shiftDate: string, swapRequested: boolean): string {
    if (swapRequested) {
      return 'bg-warning';
    }
   
    const status = this.getShiftStatus(shiftDate);
    switch (status) {
      case 'Completed':
        return 'bg-secondary';
      case 'Active':
        return 'bg-success';
      case 'Scheduled':
        return 'bg-primary';
      default:
        return 'bg-secondary';
    }
  }
 
  // Get display status text
  getDisplayStatus(shiftDate: string, swapRequested: boolean): string {
    if (swapRequested) {
      return 'Swap Requested';
    }
    return this.getShiftStatus(shiftDate);
  }
 
  // Check if actions should be shown (only for swap requests and not completed shifts)
  showActions(shiftDate: string, swapRequested: boolean): boolean {
    return swapRequested && this.getShiftStatus(shiftDate) !== 'Completed';
  }
 
  approveSwap(shiftId: number): void {
    this.swapService.approveSwapRequest(shiftId).subscribe({
      next: () => {
        this.fetchAllShifts();
        alert('Swap request approved successfully');
      },
      error: (error) => console.error('Error approving swap request:', error)
    });
  }
 
  rejectSwap(shiftId: number): void {
    this.swapService.rejectSwapRequest(shiftId).subscribe({
      next: () => {
        this.fetchAllShifts();
        alert('Swap request rejected successfully');
      },
      error: (error) => console.error('Error rejecting swap request:', error)
    });
  }
 
  onDateChange(): void {
    this.updateShiftCounts();
  }
 
  // Process swaps method
  processSwaps(): void {
    if (!this.processDate) {
      alert('Please select a date to process swaps');
      return;
    }
 
    this.swapService.processSwaps(this.processDate).subscribe({
      next: (response) => {
        alert(response);
        this.fetchAllShifts(); // Refresh the data
      },
      error: (error) => {
        console.error('Error processing swaps:', error);
        alert('Failed to process swaps. Please try again.');
      }
    });
  }
}