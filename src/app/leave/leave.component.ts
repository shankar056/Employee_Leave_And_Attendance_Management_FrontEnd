import { Component } from '@angular/core';
import { EmployeeLeaveComponentComponent } from './employee-leave-component/employee-leave-component.component';
import { ManagerLeaveComponentComponent } from './manager-leave-component/manager-leave-component.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leave',
  imports: [EmployeeLeaveComponentComponent,ManagerLeaveComponentComponent,CommonModule],
  templateUrl: './leave.component.html',
  styleUrl: './leave.component.css'
})
export class LeaveComponent {
   role:boolean=(localStorage.getItem("role")||'')==="Manager"?true:false;
}
