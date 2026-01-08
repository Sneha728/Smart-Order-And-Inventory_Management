import { Injectable,signal,computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private baseUrl = `${environment.apiUrl}/notifications`;

  private _notifications = signal<any[]>([]);
  notifications$ = computed(() => this._notifications());

  unreadCount$ = computed(
    () => this._notifications().filter(n => !n.isRead).length
  );

  constructor(private http: HttpClient) {}

  loadNotifications() {
    this.http.get<any[]>(this.baseUrl).subscribe(data => {
      this._notifications.set(data);
    });
  }
  startAutoRefresh() {
  setInterval(() => {
    this.loadNotifications();
  }, 5000); 
}

  markAsRead(notificationId: number) {
    
    this._notifications.update(list =>
      list.map(n =>
        n.notificationId === notificationId
          ? { ...n, isRead: true }
          : n
      )
    );

    
    this.http.put(`${this.baseUrl}/${notificationId}/read`, {}).subscribe();
  }
}