import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockMovement } from '../models/stock-movement';

@Injectable({
  providedIn: 'root'
})
export class StockHistory {
  private apiUrl = 'https://stockflow-api-cjd6g2d3bab4bebm.southeastasia-01.azurewebsites.net/api/Stock';

  constructor(private http: HttpClient) {}

  getStockMovements(): Observable<StockMovement[]> {
    return this.http.get<StockMovement[]>(this.apiUrl);
  }
}