import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';

import { ProductService } from '../../../services/product';
import {
  CreateProductRequest,
  UpdateProductRequest
} from '../../../models/product';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm implements OnInit {

  isSubmitting = false;
  isEditMode = false;
  productId: number | null = null;
  errorMessage = '';

  productForm;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      sku: ['', [Validators.required, Validators.maxLength(50)]],
      category: ['', [Validators.required, Validators.maxLength(100)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      lowStockThreshold: [5, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.productId = Number(id);
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          sku: product.sku,
          category: product.category,
          price: product.price,
          quantity: product.quantity,
          lowStockThreshold: product.lowStockThreshold
        });
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.errorMessage = 'Unable to load product.';
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid || this.isSubmitting) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    if (this.isEditMode && this.productId !== null) {

      const productData =
        this.productForm.getRawValue() as UpdateProductRequest;

      this.productService.updateProduct(
        this.productId,
        productData
      ).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.errorMessage =
            error.error?.message || 'Unable to update product.';
          this.isSubmitting = false;
        }
      });

    } else {

      const productData =
        this.productForm.getRawValue() as CreateProductRequest;

      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.errorMessage =
            error.error?.message || 'Unable to create product.';
          this.isSubmitting = false;
        }
      });
    }
  }
}