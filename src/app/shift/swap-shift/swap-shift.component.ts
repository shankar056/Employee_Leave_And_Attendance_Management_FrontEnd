import { Component, OnInit } from '@angular/core';
import { ManagerswapserviceService } from './managerswapservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-swap-shift',
  imports: [CommonModule,FormsModule],
  templateUrl: './swap-shift.component.html',
  styleUrls: ['./swap-shift.component.css']
})
export class SwapShiftComponent implements OnInit {
  selectedDate: string = new Date().toISOString().split('T')[0];
  shifts: any[] = [];
  filteredShifts: any[] = [];
  searchFilters = {
    employeeId: '',
    date: '',
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
        this.filteredShifts = [...this.shifts];
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
}
