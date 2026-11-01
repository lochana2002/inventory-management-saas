import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryReport } from '../models/inventory-report';

@Injectable({
  providedIn: 'root'
})
export class Reports {
  private apiUrl = 'https://stockflow-api-cjd6g2d3bab4bebm.southeastasia-01.azurewebsites.net/api/Reports';

  constructor(private http: HttpClient) {}

  getInventoryReport(): Observable<InventoryReport> {
    return this.http.get<InventoryReport>(this.apiUrl);
  }
}