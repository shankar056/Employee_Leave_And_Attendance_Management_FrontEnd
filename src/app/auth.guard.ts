import { CanActivateFn } from '@angular/router';
 
export const authGuard: CanActivateFn = (route, state) => {
  if(localStorage.getItem("role")==="Manager") {
    // User is an organizer or admin, allow access
    return true;
  }
  // User is not an organizer or admin, redirect to events page
  if(localStorage.getItem("role")==="Employee") {
    window.location.href = '';
    return false;
  }
  return false;
};
 