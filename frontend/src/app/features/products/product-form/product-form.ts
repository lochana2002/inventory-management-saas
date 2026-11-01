import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';

import { ProductService } from '../../../services/product';
import { ProductImage } from '../../../services/product-image';

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

  // Available product categories
  categories: string[] = [
    'Electronics',
    'Clothing',
    'Food & Beverages',
    'Home & Kitchen',
    'Beauty & Personal Care',
    'Furniture',
    'Stationery',
    'Sports & Outdoors',
    'Office Supplies',
    'Automotive',
    'Other'
  ];

  selectedImage: File | null = null;
  imagePreview: string | null = null;
  existingImageUrl: string | null = null;

  productForm;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private productImageService: ProductImage,
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

  getImageUrl(imageUrl?: string | null): string {
    if (!imageUrl) {
      return '';
    }

    return imageUrl.startsWith('http')
      ? imageUrl
      : `http://localhost:5174${imageUrl}`;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
      this.errorMessage = 'Please select a JPG, PNG or WEBP image.';
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'Image size cannot exceed 5 MB.';
      input.value = '';
      return;
    }

    this.errorMessage = '';
    this.selectedImage = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  removeSelectedImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
  }

  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {

        // Preserve an existing category if it is not in the dropdown list
        if (
          product.category &&
          !this.categories.includes(product.category)
        ) {
          this.categories = [
            ...this.categories,
            product.category
          ];
        }

        this.productForm.patchValue({
          name: product.name,
          sku: product.sku,
          category: product.category,
          price: product.price,
          quantity: product.quantity,
          lowStockThreshold: product.lowStockThreshold
        });

        this.existingImageUrl = product.imageUrl
          ? this.getImageUrl(product.imageUrl)
          : null;
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
          this.uploadImageIfSelected(this.productId!);
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
        next: (createdProduct) => {
          if (this.selectedImage) {
            this.uploadImageIfSelected(createdProduct.id);
          } else {
            this.isSubmitting = false;
            this.router.navigate(['/products']);
          }
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

  private uploadImageIfSelected(productId: number): void {
    if (!this.selectedImage) {
      this.isSubmitting = false;
      this.router.navigate(['/products']);
      return;
    }

    this.productImageService.uploadImage(
      productId,
      this.selectedImage
    ).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Image upload failed:', error);
        this.errorMessage =
          'Product was saved, but image upload failed. Please try editing the product and uploading the image again.';
        this.isSubmitting = false;
      }
    });
  }
}