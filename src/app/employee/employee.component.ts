 
import { Component, OnInit } from '@angular/core';
import { EmployeeserviceService, Employee } from './employeeservice.service';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [AddEmployeeComponent, CommonModule, FormsModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchQuery: string = '';
  isAddEmployeeFormVisible = false;
  editingEmployee: Employee | null = null;
  userRole: string | null = null;
  loggedInEmployee: Employee | null = null;
 
  constructor(private employeeService: EmployeeserviceService) {}
 
  ngOnInit(): void {
    this.userRole = localStorage.getItem('role');
    if (this.userRole === 'Employee') {
      this.loadLoggedInEmployee();
    } else {
      this.refreshEmployeeList();
    }
  }
 
  loadLoggedInEmployee(): void {
    const employeeId = localStorage.getItem('userId');
    if (employeeId) {
      this.employeeService.getEmployeesFromBackend().subscribe({
        next: (employees: Employee[]) => {
          this.loggedInEmployee = employees.find(emp => emp.id === +employeeId) || null;
          if (this.loggedInEmployee) {
            this.editingEmployee = { ...this.loggedInEmployee };
            this.isAddEmployeeFormVisible = true;
          }
        },
        error: (err) => console.error('Failed to fetch employee data:', err)
      });
    }
  }
 
  refreshEmployeeList(): void {
    this.employeeService.getEmployeesFromBackend().subscribe({
      next: (data: Employee[]) => {
        this.employees = data;
        this.filteredEmployees = [...this.employees];
      },
      error: (err) => console.error('Failed to fetch employees:', err)
    });
  }
 
  filterEmployees(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredEmployees = this.employees.filter(employee => {
      const matchesId = employee.id.toString().includes(query);
      const matchesOtherFields =
        employee.name.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.role.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query);
      return matchesId || matchesOtherFields;
    });
  }
 
  showAddEmployeeForm(): void {
    this.isAddEmployeeFormVisible = true;
    this.editingEmployee = null;
  }
 
  editEmployee(employee: Employee): void {
    if (!employee.id) {
      console.error('Employee ID is undefined. Cannot edit employee.');
      return;
    }
    this.editingEmployee = { ...employee };
    this.isAddEmployeeFormVisible = true;
  }
 
  onFormSubmit(employee: Employee): void {
    if (this.editingEmployee) {
      this.employeeService.updateEmployee(employee).subscribe({
        next: () => {
          if (this.userRole === 'Employee') {
            this.loadLoggedInEmployee();
          } else {
            this.refreshEmployeeList();
          }
          this.isAddEmployeeFormVisible = false;
        },
        error: (err) => console.error('Failed to update employee:', err)
      });
    } else {
      this.employeeService.addEmployee(employee).subscribe({
        next: () => {
          this.refreshEmployeeList();
          this.isAddEmployeeFormVisible = false;
        },
        error: (err) => console.error('Failed to add employee:', err)
      });
    }
  }
 
  deleteEmployee(id: number): void {
    if (!id) {
      console.error('Employee ID is undefined. Cannot delete employee.');
      return;
    }
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => this.refreshEmployeeList(),
      error: (err) => console.error('Failed to delete employee:', err)
    });
  }
}
 