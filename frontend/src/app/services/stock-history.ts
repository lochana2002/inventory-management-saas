import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockMovement } from '../models/stock-movement';

@Injectable({
  providedIn: 'root'
})
export class StockHistory {
  private apiUrl = 'http://localhost:5174/api/Stock';

  constructor(private http: HttpClient) {}

  getStockMovements(): Observable<StockMovement[]> {
    return this.http.get<StockMovement[]>(this.apiUrl);
  }
}