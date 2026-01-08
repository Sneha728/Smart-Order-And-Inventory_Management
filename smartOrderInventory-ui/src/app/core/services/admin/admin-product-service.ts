import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminProductService {

  private baseUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  // ---------- GET ALL PRODUCTS ----------
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // ---------- GET PRODUCT BY ID ----------
getProductById(id: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/${id}`);
}


  // ---------- CREATE PRODUCT ----------
  createProduct(payload: {
    productName: string;
    price: number;
    categoryId: number;
    stock?: number; // optional (warehouse will manage)
  }) {
    return this.http.post(
      this.baseUrl,
      payload,
      { responseType: 'text' }
    );
  }

  // ---------- UPDATE PRODUCT ----------
  updateProduct(
    id: number,
    payload: {
      productName: string;
      price: number;
      categoryId: number;
      stock?: number;
    }
  ) {
    return this.http.put(
      `${this.baseUrl}/${id}`,
      payload,
      { responseType: 'text' }
    );
  }

  //  TOGGLE PRODUCT STATUS (ACTIVE / INACTIVE)
  toggleProductStatus(id: number) {
    return this.http.put(
      `${this.baseUrl}/${id}/status`,
      {},
      { responseType: 'text' }
    );
  }

  // ---------- DELETE (SOFT DELETE )
  deleteProduct(id: number) {
    return this.http.delete(
      `${this.baseUrl}/${id}`,
      { responseType: 'text' }
    );
  }
}
