import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { UserService } from './userservice.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,SidebarComponent,CommonModule,RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLoggedIn: boolean = false;
  username: string | null = null;
  role: string | null = null;
  userId: number | null = null;
  ngOnInit(): void {
    this.checkLoginStatus();
  }
  constructor(private router: Router,private userService:UserService) {}
  checkLoginStatus(): void {
    this.username = localStorage.getItem('username');
    this.role = localStorage.getItem('role');
    this.isLoggedIn = !!this.username; // Check if the user is logged in

    // Fetch and store the user ID
    if (this.isLoggedIn && this.username) {
      this.userService.getUserId(this.username).subscribe({
        next: (id) => {
          console.log("User ID:", id);
          this.userId = id; // Store the ID in a variable
          localStorage.setItem('userId', id.toString()); // Store the ID in local storage
        },
        error: (error) => {
          console.error("Failed to fetch User ID", error);
        }
      });
    }
  }
 
  logout(): void {
    localStorage.clear(); // Clear all stored data
    this.isLoggedIn = false;
    this.username = null;
    this.role = null;
    this.userId = null; // Clear the stored ID
    this.router.navigate(['/login']);
  }
}
