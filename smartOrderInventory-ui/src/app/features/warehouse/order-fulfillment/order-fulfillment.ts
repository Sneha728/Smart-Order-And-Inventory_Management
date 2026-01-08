import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import {
  WarehouseOrderService,
  OrderStatus,
  NextOrderStatus
} from '../../../core/services/warehouse/warehouse-order-service';

import { ToastService } from '../../../core/services/toast-service';
import { NotificationService } from '../../../core/services/notification-service';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  standalone: true,
  selector: 'app-order-fulfillment',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './order-fulfillment.html',
  styleUrls: ['./order-fulfillment.css']
})
export class OrderFulfillmentComponent implements OnInit {

  displayedColumns = ['orderId', 'date', 'status', 'progress', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  
  statuses: OrderStatus[] = [
    'Created',
    'Approved',
    'Packed',
    'Shipped',
    'Delivered'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

 
  warehouseId = 1;

  constructor(
    private orderService: WarehouseOrderService,
    private toast: ToastService,
    private notificationService: NotificationService,
    private auth: AuthService 
  ) {}

  ngOnInit(): void {
     const wid = this.auth.getWarehouseId();

    if (!wid) {
      this.toast.error('Warehouse not assigned');
      return;
    }

    this.warehouseId = wid;
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getWarehouseOrders(this.warehouseId).subscribe({
      next: (res) => {
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
      },
      error: () => this.toast.error('Failed to load warehouse orders')
    });
  }

  getStatusIndex(status: OrderStatus): number {
    return this.statuses.indexOf(status);
  }

  canMoveNext(order: any): boolean {
    return order.status !== 'Delivered';
  }

  moveNext(order: any) {
    const currentIndex = this.getStatusIndex(order.status as OrderStatus);

    const nextStatus =
      this.statuses[currentIndex + 1] as NextOrderStatus;

    if (!nextStatus) return;

    this.orderService.updateStatus(order.orderId, nextStatus).subscribe({
      next: () => {
        this.toast.success(`Order marked as ${nextStatus}`);
        this.loadOrders();
        this.notificationService.loadNotifications();
      },
      error: () => this.toast.error('Failed to update order status')
    });
  }
}
