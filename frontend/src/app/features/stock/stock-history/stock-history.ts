import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockHistory } from '../../../services/stock-history';
import { StockMovement } from '../../../models/stock-movement';

@Component({
  selector: 'app-stock-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-history.html',
  styleUrl: './stock-history.css'
})
export class StockHistoryComponent implements OnInit {

  movements: StockMovement[] = [];
  searchTerm = '';
  selectedType = 'All';

  isLoading = false;
  errorMessage = '';

  constructor(private stockHistoryService: StockHistory) {}

  ngOnInit(): void {
    this.loadMovements();
  }

  loadMovements(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.stockHistoryService.getStockMovements().subscribe({
      next: (data) => {
        this.movements = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading stock history:', error);
        this.errorMessage = 'Unable to load stock movement history.';
        this.isLoading = false;
      }
    });
  }

  get filteredMovements(): StockMovement[] {
    return this.movements.filter(movement => {

      const matchesSearch =
        movement.productName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        movement.sku.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesType =
        this.selectedType === 'All' ||
        movement.type === this.selectedType;

      return matchesSearch && matchesType;
    });
  }

  get stockInCount(): number {
    return this.movements.filter(m => m.type === 'StockIn').length;
  }

  get stockOutCount(): number {
    return this.movements.filter(m => m.type === 'StockOut').length;
  }
}