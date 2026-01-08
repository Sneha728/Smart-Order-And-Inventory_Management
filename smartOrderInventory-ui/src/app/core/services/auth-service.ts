import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ---------- AUTH APIs ----------

  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, data).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  // ---------- TOKEN HELPERS ----------

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  getWarehouseId(): number | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.warehouseId ? Number(payload.warehouseId) : null;
}


  // ---------- ROLE (USED IN NAVBAR, GUARDS, SIDEBAR) ----------

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  }

  getUserEmail(): string | null {
  const token = this.getToken();
  if (!token) return null;

  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.email || payload.unique_name || null;
}


  // ---------- LOGOUT ----------

  logout(): void {
    localStorage.removeItem('token');
  }
}
