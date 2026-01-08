import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Order } from '../../../shared/models/Order';

export type OrderStatus =
  | 'Created'
  | 'Approved'
  | 'Packed'
  | 'Shipped'
  | 'Delivered';

@Injectable({
  providedIn: 'root',
})
export class CustomerOrderService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ==============================
  // GET WAREHOUSES (for dropdown)
  // ==============================
  getWarehouses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/warehouses`);
  }

  // ==============================
  // GET ACTIVE PRODUCTS (for order)
  // ==============================
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/products`);
  }

  // ==============================
// GET PRODUCTS BY WAREHOUSE
// ==============================
getProductsByWarehouse(warehouseId: number): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.baseUrl}/warehouses/${warehouseId}/products`
  );
}


  // ==============================
  // PLACE ORDER (Customer)
  // ==============================
placeOrder(payload: Order): Observable<string> {
  return this.http.post(
    `${this.baseUrl}/Orders`,
    payload,
    { responseType: 'text' }
  );
}

  // ==============================
  // GET MY ORDERS (Customer)
  // ==============================
  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/orders`);
  }
  getCustomers(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/admin/customers`);
}

  // ==============================
  // PAY FOR ORDER
  // ==============================
  payOrder(orderId: number) {
    return this.http.post(
      `${this.baseUrl}/orders/${orderId}/pay`,
      {},
      { responseType: 'text' }
    );
  }
  cancelOrder(orderId: number) {
    return this.http.put(
      `${this.baseUrl}/orders/${orderId}/cancel`,
      {},
      { responseType: 'text' }
    );
  }
}
