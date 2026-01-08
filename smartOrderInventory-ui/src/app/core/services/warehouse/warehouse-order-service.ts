import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export type OrderStatus =
  | 'Created'
  | 'Approved'
  | 'Packed'
  | 'Shipped'
  | 'Delivered';

export type NextOrderStatus =
  | 'Approved'
  | 'Packed'
  | 'Shipped'
  | 'Delivered';

@Injectable({ providedIn: 'root' })
export class WarehouseOrderService {

  // ✅ CORRECT base URL
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ✅ GET ORDERS BY WAREHOUSE
  getWarehouseOrders(warehouseId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/warehouses/${warehouseId}/orders`
    );
  }

  // ✅ UPDATE ORDER STATUS
  updateStatus(
    orderId: number,
    status: NextOrderStatus
  ) {
    return this.http.put(
      `${this.baseUrl}/orders/${orderId}/status`,
      { status },
      { responseType: 'text' }
    );
  }
}
