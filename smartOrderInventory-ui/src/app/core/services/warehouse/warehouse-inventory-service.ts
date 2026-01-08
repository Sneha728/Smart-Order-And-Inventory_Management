import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WarehouseInventoryService {

  private baseUrl = `${environment.apiUrl}/inventory`;

  constructor(private http: HttpClient) {}

  // =====================================
  // GET ALL INVENTORY (WAREHOUSE VIEW)
  // =====================================
  getInventory(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // =====================================
  // ADD / UPDATE STOCK
  // =====================================
  updateStock(payload: {
    productId: number;
    quantity: number;
  }) {
    return this.http.put(
      this.baseUrl,
      payload,
      { responseType: 'text' }
    );
  }

  // =====================================
  // GET LOW STOCK PRODUCTS
  // =====================================
  getLowStock(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/low-stock`
    );
  }

  // =====================================
  // GET INVENTORY BY PRODUCT ID (OPTIONAL)
  // =====================================
  getInventoryByProduct(productId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/product/${productId}`
    );
  }
}
