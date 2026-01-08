import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminCategoryService {

  private baseUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<any[]>(this.baseUrl);
  }

  createCategory(payload: { categoryName: string }) {
    return this.http.post(this.baseUrl, payload, { responseType: 'text' });
  }

  updateCategory(id: number, payload: { categoryName: string }) {
    return this.http.put(`${this.baseUrl}/${id}`, payload, { responseType: 'text' });
  }

  deactivateCategory(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  toggleCategoryStatus(id: number) {
  return this.http.put(
    `${this.baseUrl}/${id}/status`,
    {},
    { responseType: 'text' }
  );
}

deleteCategory(id: number) {
  return this.http.delete(
    `${this.baseUrl}/${id}`,
    { responseType: 'text' }
  );
}

}
