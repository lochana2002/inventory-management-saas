import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product';
import { Product } from '../../../models/product';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {

  products: Product[] = [];
  isLoading = false;
  errorMessage = '';

  searchTerm = '';
selectedCategory = '';
selectedStockStatus = '';

categories: string[] = [];

filteredProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  deleteProduct(id: number): void {
  const confirmed = confirm(
    'Are you sure you want to delete this product?'
  );

  if (!confirmed) {
    return;
  }

  this.productService.deleteProduct(id).subscribe({
    next: () => {
      this.products = this.products.filter(
        product => product.id !== id
      );
    },
    error: (error) => {
      console.error('Error deleting product:', error);
      this.errorMessage = 'Unable to delete product.';
    }
  });
}
applyFilters(): void {
  const search = this.searchTerm.trim().toLowerCase();

  this.filteredProducts = this.products.filter(product => {

    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.sku.toLowerCase().includes(search);

    const matchesCategory =
      !this.selectedCategory ||
      product.category === this.selectedCategory;

    const isLowStock =
      product.quantity <= product.lowStockThreshold;

    const matchesStockStatus =
      !this.selectedStockStatus ||
      (this.selectedStockStatus === 'low' && isLowStock) ||
      (this.selectedStockStatus === 'in' && !isLowStock);

    return matchesSearch && matchesCategory && matchesStockStatus;
  });
}

clearFilters(): void {
  this.searchTerm = '';
  this.selectedCategory = '';
  this.selectedStockStatus = '';

  this.applyFilters();
}

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;

this.categories = [
  ...new Set(data.map(product => product.category))
];

this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('API error:', error);
        this.errorMessage = 'Unable to load products.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}