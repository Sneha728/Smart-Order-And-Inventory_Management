import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private baseUrl = `${environment.apiUrl}/admin/users`;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<any[]>(this.baseUrl);
  }

createUser(data: any) {
  return this.http.post(
    `${this.baseUrl}`,
    data,
    { responseType: 'text' } 
  );
}

updateRole(id: string, payload: {
  email: string;
  password: string;
  role: string;
}) {
  return this.http.put(
    `${this.baseUrl}/${id}/role`,
    payload, { responseType: 'text' }
  );
}


 toggleStatus(id: string, isActive: boolean) {
  return this.http.put(`${this.baseUrl}/${id}/status`, {
    isActive
  }, { responseType: 'text' });
}

deleteUser(id: string) {
  return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
}



getWarehouses() {
  return this.http.get<any[]>(`${this.apiUrl}/warehouses`);
}
}
