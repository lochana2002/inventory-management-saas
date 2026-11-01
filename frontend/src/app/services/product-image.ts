import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ImageUploadResponse {
  message: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductImage {
  private apiUrl = 'http://localhost:5174/api/ProductImages';

  constructor(private http: HttpClient) {}

  uploadImage(productId: number, image: File): Observable<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('image', image);

    return this.http.post<ImageUploadResponse>(
      `${this.apiUrl}/${productId}`,
      formData
    );
  }
}