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
  private apiUrl = 'https://stockflow-api-cjd6g2d3bab4bebm.southeastasia-01.azurewebsites.net/api/ProductImages';

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