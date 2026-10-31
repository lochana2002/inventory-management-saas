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
import { StockService } from '../../../services/stock';

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

selectedProduct: Product | null = null;

adjustmentType: 'in' | 'out' = 'in';

adjustmentQuantity = 1;

isAdjusting = false;

stockMessage = '';

stockError = '';

  constructor(
  private productService: ProductService,
  private stockService: StockService,
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

openStockAdjustment(
  product: Product,
  type: 'in' | 'out'
): void {
  this.selectedProduct = product;
  this.adjustmentType = type;
  this.adjustmentQuantity = 1;
  this.stockMessage = '';
  this.stockError = '';
}

cancelStockAdjustment(): void {
  this.selectedProduct = null;
  this.stockMessage = '';
  this.stockError = '';
}

submitStockAdjustment(): void {
  if (!this.selectedProduct) {
    return;
  }

  if (
    !Number.isInteger(this.adjustmentQuantity) ||
    this.adjustmentQuantity < 1
  ) {
    this.stockError = 'Please enter a valid quantity greater than zero.';
    return;
  }

  const productId = this.selectedProduct.id;

  if (
    this.adjustmentType === 'out' &&
    this.adjustmentQuantity > this.selectedProduct.quantity
  ) {
    this.stockError = 'Insufficient stock available.';
    return;
  }

  this.isAdjusting = true;
  this.stockError = '';
  this.stockMessage = '';

  const request = {
    quantity: this.adjustmentQuantity
  };

  const operation =
    this.adjustmentType === 'in'
      ? this.stockService.stockIn(productId, request)
      : this.stockService.stockOut(productId, request);

  operation.subscribe({
    next: (response) => {
      this.products = this.products.map(product =>
        product.id === productId
          ? { ...product, quantity: response.newQuantity }
          : product
      );

      this.applyFilters();

      this.stockMessage = response.message;
      this.selectedProduct = null;
      this.isAdjusting = false;

      this.cdr.detectChanges();
    },

    error: (error) => {
      this.stockError =
        error.error?.message ||
        'Unable to update stock. Please try again.';

      this.isAdjusting = false;
      this.cdr.detectChanges();
    }
  });
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