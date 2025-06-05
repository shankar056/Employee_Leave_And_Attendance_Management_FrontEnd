import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { EmployeeComponent } from './employee/employee.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { LeaveComponent } from './leave/leave.component';
import { EmployeeShiftComponent } from './shift/employee-shift/employee-shift.component';
import { ShiftComponent } from './shift/shift.component';
import { SwapShiftComponent } from './shift/swap-shift/swap-shift.component';
import { ManagerShiftComponent } from './shift/manager-shift/manager-shift.component';
import { ReportComponent } from './report/report.component';
import { EmployeeatendanceComponent } from './attendance/employeeatendance/employeeatendance.component';
import { AttendanceComponent } from './attendance/attendance.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent }, // Default landing page
    { path: 'employee', component: EmployeeComponent }, // Employee management page
    { path: 'login', component: LoginComponent }, // Login page
    { path: 'register', component: RegistrationComponent }, // Registration page
    {path:'leave',component:LeaveComponent},
    {path:'shift',component:EmployeeShiftComponent},
    {path:"swap-shift",component:SwapShiftComponent},
    {path:'manager-shift',component:ManagerShiftComponent},
    {path:'report',component:ReportComponent},
    {path:'attendance', component:AttendanceComponent}, // Lazy-loaded attendance component
    { path: '**', redirectTo: '' } // Fallback route
];