import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, Input } from '@angular/core';
import { ReportserviceService } from '../reportservice.service';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule, DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';

interface AttendanceRecord {
  employeeId: number;
  date: string;
  clockIn: string;
  clockOut: string;
  workHours: number;
}

interface LeaveBalance {
  id: number;
  employeeId: number;
  leaveType: string;
  balance: number;
}

interface LeaveRecord {
  leaveId: number;
  employeeId: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface ShiftRecord {
  id: number;
  employeeId: number;
  shiftType: string;
  swapRequested: boolean;
}

interface ReportData {
  employeeId: number;
  attendanceReport: {
    attendance: AttendanceRecord[];
    monthlyReport: {
      [key: string]: {
        TotalDays: number;
        MonthlyAverageHours: number;
        WeeklyAverageHours: {
          [key: string]: number;
        };
      };
    };
  };
  leaveBalance: LeaveBalance[];
  leaveRecords: LeaveRecord[];
  shift: {
    shift: ShiftRecord[];
    shiftReport: {
      [key: string]: number;
    };
  };
}

@Component({
  selector: 'app-employeereport',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './employeereport.component.html',
  styleUrls: ['./employeereport.component.css']
})
export class EmployeereportComponent implements OnInit, OnDestroy,OnChanges {
  @Input() employeeId?: number;
  reportData: ReportData | null = null;
  attendanceChart: Chart | null = null;
  shiftChart: Chart | null = null;
  leaveChart: Chart | null = null;
  today = new Date();
  private subscription: Subscription | null = null;

  constructor(private reportService: ReportserviceService) {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes['employeeId'] && !changes['employeeId'].firstChange) {
      this.loadReport(changes['employeeId'].currentValue);
    }
  }
  ngOnInit(): void {
    let employeeId: number;
    const role:String=localStorage.getItem('role')||'';
    if (role === 'Manager') {
      employeeId= Number(localStorage.getItem('selectedEmployeeId'))
    }
    else{
      employeeId = Number(localStorage.getItem('userId'));
    }
    if (!employeeId) {
      console.error('No employee ID found in localStorage');
      return;
    }
    this.loadReport(employeeId);
  }
 

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.destroyCharts();
  }

  private destroyCharts(): void {
    [this.attendanceChart, this.shiftChart, this.leaveChart].forEach(chart => {
      chart?.destroy();
    });
  }

  loadReport(employeeId: number): void {
    this.subscription = this.reportService.getEmployeeReport(employeeId).subscribe({
      next: (data: ReportData) => {
        this.reportData = data;
        this.createCharts();
      },
      error: (error) => {
        console.error('Error loading report:', error);
        // Here you could add error handling UI logic
      }
    });
  }

  createCharts(): void {
    if (!this.reportData) return;

    this.destroyCharts();

    // Attendance Chart
    this.createAttendanceChart();
    // Leave Chart
    this.createLeaveChart();
    // Shift Chart
    this.createShiftChart();
  }

  private createAttendanceChart(): void {
    const monthlyData = this.reportData?.attendanceReport.monthlyReport['2025-06'];
    if (!monthlyData) return;
    
    this.attendanceChart = new Chart('attendanceChart', {
      type: 'bar',
      data: {
        labels: Object.keys(monthlyData.WeeklyAverageHours),
        datasets: [{
          label: 'Weekly Average Hours',
          data: Object.values(monthlyData.WeeklyAverageHours),
          backgroundColor: 'rgba(33, 150, 243, 0.6)',
          borderColor: '#2196f3',
          borderWidth: 2,
          borderRadius: 8,
          barThickness: 30
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: '#fff' }
          },
          title: {
            color: '#fff',
            font: { size: 16 }
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: '#fff' }
          },
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: '#fff' }
          }
        }
      }
    });
  }

  private createLeaveChart(): void {
    if (!this.reportData?.leaveRecords) return;

    const leaveStatus = this.reportData.leaveRecords.reduce((acc: {[key: string]: number}, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {});

    this.leaveChart = new Chart('leaveChart', {
      type: 'doughnut',
      data: {
        labels: Object.keys(leaveStatus),
        datasets: [{
          data: Object.values(leaveStatus),
          backgroundColor: ['#4caf50', '#f44336', '#2196f3'],
          borderWidth: 0,
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#fff', usePointStyle: true }
          }
        }
      }
    });
  }

  private createShiftChart(): void {
    if (!this.reportData?.shift.shiftReport) return;

    this.shiftChart = new Chart('shiftChart', {
      type: 'doughnut',
      data: {
        labels: Object.keys(this.reportData.shift.shiftReport),
        datasets: [{
          data: Object.values(this.reportData.shift.shiftReport),
          backgroundColor: ['#505050', '#FFD700'], // Darker grey for day, golden for night
          
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#fff' // Set text color to white
            }
          }
        }
      }
    });
  }

  getTotalWorkHours(): number {
    if (!this.reportData?.attendanceReport?.attendance) return 0;
    return this.reportData.attendanceReport.attendance
      .reduce((total, record) => total + record.workHours, 0);
  }

  getAttendanceRate(): number {
    if (!this.reportData?.attendanceReport?.attendance) return 0;
    const totalDays = this.reportData.attendanceReport.attendance.length;
    const fullDays = this.reportData.attendanceReport.attendance
      .filter(record => record.workHours >= 8).length;
    return Math.round((fullDays / totalDays) * 100);
  }

  exportToExcel(): void {
    if (!this.reportData?.attendanceReport?.attendance) return;

    const data = this.reportData.attendanceReport.attendance.map(record => ({
      Date: new Date(record.date).toLocaleDateString(),
      'Clock In': new Date(record.clockIn).toLocaleTimeString(),
      'Clock Out': new Date(record.clockOut).toLocaleTimeString(),
      'Work Hours': record.workHours,
      Status: record.workHours >= 8 ? 'Full Day' : 'Partial Day'
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Records');
    XLSX.writeFile(wb, 'attendance-report.xlsx');
  }

  async downloadPDF(): Promise<void> {
    const element = document.getElementById('reportContent');
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight-100);
      pdf.save(`employee-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Here you could add error handling UI logic
    }
  }
}