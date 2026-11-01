import { Component } from '@angular/core';
import {
  Router,
  RouterOutlet,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css'
})
export class DashboardLayout {

  userName = localStorage.getItem('userName') || 'User';

  isMobileMenuOpen = false;

  constructor(private router: Router) {}

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  logout(): void {
    this.closeMobileMenu();

    localStorage.removeItem('accessToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');

    this.router.navigate(['/login']);
  }
}