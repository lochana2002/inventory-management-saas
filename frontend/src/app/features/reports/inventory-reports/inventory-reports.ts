
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reports } from '../../../services/reports';
import { InventoryReport } from '../../../models/inventory-report';

@Component({
  selector: 'app-inventory-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory-reports.html',
  styleUrl: './inventory-reports.css'
})
export class InventoryReports implements OnInit {

  report: InventoryReport | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(private reportsService: Reports) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.reportsService.getInventoryReport().subscribe({
      next: (data) => {
        this.report = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Report loading error:', error);
        this.errorMessage = 'Unable to load inventory reports.';
        this.isLoading = false;
      }
    });
  }

  getMaxQuantity(): number {
    if (!this.report?.stockByCategory?.length) {
      return 0;
    }

    return Math.max(
      ...this.report.stockByCategory.map(
        category => category.totalQuantity
      )
    );
  }

  getQuantityPercentage(quantity: number): number {
    const maxQuantity = this.getMaxQuantity();

    if (maxQuantity === 0) {
      return 0;
    }

    return (quantity / maxQuantity) * 100;
  }
}
