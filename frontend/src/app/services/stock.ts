import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  StockAdjustmentRequest,
  StockAdjustmentResponse
} from '../models/stock-adjustment';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private apiUrl = 'http://localhost:5174/api/Stock';

  constructor(private http: HttpClient) {}

  stockIn(
    productId: number,
    data: StockAdjustmentRequest
  ): Observable<StockAdjustmentResponse> {
    return this.http.post<StockAdjustmentResponse>(
      `${this.apiUrl}/${productId}/in`,
      data
    );
  }

  stockOut(
    productId: number,
    data: StockAdjustmentRequest
  ): Observable<StockAdjustmentResponse> {
    return this.http.post<StockAdjustmentResponse>(
      `${this.apiUrl}/${productId}/out`,
      data
    );
  }
}