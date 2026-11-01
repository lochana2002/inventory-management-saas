import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DashboardService } from '../../../services/dashboard';
import { DashboardStats } from '../../../models/dashboard-stats';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  userName = localStorage.getItem('userName') || 'User';

  stats: DashboardStats | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;

    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Dashboard statistics error:', error);
        this.errorMessage = 'Unable to load dashboard statistics.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');

    this.router.navigate(['/login']);
  }
}