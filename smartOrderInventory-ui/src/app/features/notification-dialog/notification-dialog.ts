import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../core/services/notification-service';

@Component({
  standalone: true,
  selector: 'app-notification-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './notification-dialog.html',
  styleUrls: ['./notification-dialog.css']
})
export class NotificationDialogComponent {

  notifications = computed(() =>
    this.notificationService.notifications$()
  );

  constructor(private notificationService: NotificationService) {
    this.notificationService.loadNotifications();
  }

  markRead(n: any) {
    if (!n.isRead) {
      this.notificationService.markAsRead(n.notificationId);
    }
  }
}
