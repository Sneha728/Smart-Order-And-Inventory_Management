import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../services/auth-service';
import { NotificationService } from '../../services/notification-service';
import { NotificationDialogComponent } from '../../../features/notification-dialog/notification-dialog';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule,MatBadgeModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {

  userRole = 'User';

  constructor(
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    public notificationService: NotificationService 
  ) {}

  ngOnInit(): void {
    this.userRole = this.auth.getUserRole() || 'User';

    if (this.userRole === 'Customer' || this.userRole === 'WarehouseManager' || this.userRole === 'SalesExecutive') {
      this.notificationService.loadNotifications();
      this.notificationService.startAutoRefresh();
    }
  }

  openNotifications() {
    this.notificationService.loadNotifications();
    this.dialog.open(NotificationDialogComponent, {
      width: '420px',
      position: { top: '60px', right: '20px' }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
