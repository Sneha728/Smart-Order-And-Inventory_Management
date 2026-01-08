import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { interval, Subscription } from 'rxjs';


import { CustomerOrderService } from '../../../core/services/customer/customer-order-service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';

/* Material */
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './order-tracking.html',
  styleUrls: ['./order-tracking.css']
})
export class OrderTrackingComponent
  implements OnInit, AfterViewInit {

  displayedColumns = ['order', 'warehouse', 'date', 'status', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  expandedOrderId: number | null = null;
  private statusRefreshSub!: Subscription;


  timeline = ['Created', 'Approved', 'Packed', 'Shipped', 'Delivered'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: CustomerOrderService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

ngOnInit() {
  this.loadOrders();
  this.statusRefreshSub = interval(5000).subscribe(() => {
    this.refreshOrderStatuses();
  });
}


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data, filter) => {
      const v = filter.toLowerCase();
      return (
        data.orderId.toString().includes(v) ||
        data.status.toLowerCase().includes(v)
      );
    };
  }
  ngOnDestroy() {
  if (this.statusRefreshSub) {
    this.statusRefreshSub.unsubscribe();
  }
}


  loadOrders() {
    this.service.getMyOrders().subscribe({
      next: (res) => {
        this.dataSource.data = res.sort(
          (a: any, b: any) =>
            new Date(b.orderDate).getTime() -
            new Date(a.orderDate).getTime()
        );

        this.sort.active = 'date';
        this.sort.direction = 'desc';
        this.sort.sortChange.emit();
      },
      error: () => {
        this.snack.open(
          'Failed to load orders',
          'OK',
          { duration: 3000, panelClass: ['toast-error'] }
        );
      }
    });
  }
  refreshOrderStatuses() {
  this.service.getMyOrders().subscribe({
    next: (latestOrders) => {

      const map = new Map(
        latestOrders.map((o: any) => [o.orderId, o.status])
      );

      
      this.dataSource.data = this.dataSource.data.map(o => ({
        ...o,
        status: map.get(o.orderId) ?? o.status
      }));
    }
  });
}


  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
    this.paginator.firstPage();
  }

  toggleView(orderId: number) {
    this.expandedOrderId =
      this.expandedOrderId === orderId ? null : orderId;
  }

  canCancel(status: string): boolean {
    return status === 'Created'
        || status === 'Approved'
        || status === 'Packed';
  }

  cancel(order: any) {
    if (!this.canCancel(order.status)) {
      this.snack.open(
        'Order cannot be cancelled after shipment',
        'OK',
        { duration: 3000, panelClass: ['toast-error'] }
      );
      return;
    }

    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Cancel Order',
        message: 'Are you sure you want to cancel this order?'
      }
    });

    ref.afterClosed().subscribe(ok => {
      if (!ok) return;

      this.service.cancelOrder(order.orderId).subscribe({
        next: () => {
          order.status = 'Cancelled';

          this.snack.open(
            'Order cancelled successfully',
            'OK',
            { duration: 3000, panelClass: ['toast-success'] }
          );

          this.dataSource.data = [...this.dataSource.data];
        },
        error: () => {
          this.snack.open(
            'Failed to cancel order',
            'OK',
            { duration: 3000, panelClass: ['toast-error'] }
          );
        }
      });
    });
  }

  getStatusIndex(status: string) {
    if (status === 'Cancelled') return -1;
    return this.timeline.indexOf(status);
  }
}
