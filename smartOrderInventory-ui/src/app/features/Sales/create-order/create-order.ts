import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

/* Material */
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { CustomerOrderService } from '../../../core/services/customer/customer-order-service';
import { AddToCartDialogComponent } from '../../customer/add-to-cart-dialog';
import { PaymentDialogComponent } from '../../customer/payment-dialog';

@Component({
  selector: 'app-sales-create-order',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './create-order.html',
  styleUrls: ['./create-order.css']
})
export class CreateOrderComponent implements OnInit {

  warehouses: any[] = [];
  customers: any[] = [];

  allProducts: any[] = [];
  filteredProducts: any[] = [];
  tableProducts: any[] = [];

  cart = signal<any[]>([]);

  selectedWarehouseId!: number;
  selectedCustomerEmail!: string;

  searchTerm = '';
  pageIndex = 0;
  pageSize = 5;

  productColumns = ['product', 'price', 'action'];
  cartColumns = ['product', 'qty', 'subtotal', 'action'];

  constructor(
    private service: CustomerOrderService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadWarehouses();
    this.loadCustomers();
  }

  loadWarehouses() {
    this.service.getWarehouses().subscribe(res => this.warehouses = res);
  }

  loadCustomers() {
    this.service.getCustomers().subscribe(res => this.customers = res);
  }

  onWarehouseChange(id: number) {
    this.selectedWarehouseId = id;
    this.cart.set([]);

    this.service.getProductsByWarehouse(id).subscribe(res => {
      this.allProducts = res.filter(p => p.stock > 0);
      this.applyFilter();
    });
  }

  /* ================= FILTER & PAGINATION ================= */
  applyFilter() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.allProducts.filter(p =>
      p.productName.toLowerCase().includes(term)
    );

    const start = this.pageIndex * this.pageSize;
    this.tableProducts = this.filteredProducts.slice(start, start + this.pageSize);
  }

  onSearchChange(val: string) {
    this.searchTerm = val;
    this.pageIndex = 0;
    this.applyFilter();
  }

  onPageChange(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.applyFilter();
  }

  /* ================= ADD TO CART ================= */
  addToCart(product: any) {

    if (!this.selectedCustomerEmail || !this.selectedWarehouseId) {
      this.snack.open(
        'Please select customer and warehouse first',
        'Close',
        { duration: 3000, panelClass: ['toast-error'] }
      );
      return;
    }

    const existing = this.cart().find(c => c.productId === product.productId);
    const alreadyInCart = existing?.qty ?? 0;
    const remainingStock = product.stock - alreadyInCart;

    if (remainingStock <= 0) {
      this.snack.open(
        `Only ${product.stock} units available`,
        'Close',
        { duration: 3000, panelClass: ['toast-error'] }
      );
      return;
    }

    const ref = this.dialog.open(AddToCartDialogComponent, {
      width: '360px',
      data: { product, maxQty: remainingStock }
    });

    ref.afterClosed().subscribe(qty => {
      if (!qty || qty <= 0) return;

      if (qty > remainingStock) {
        this.snack.open(
          `Only ${remainingStock} units available`,
          'Close',
          { duration: 3000, panelClass: ['toast-error'] }
        );
        return;
      }

      if (existing) {
        this.cart.set(
          this.cart().map(c =>
            c.productId === product.productId
              ? { ...c, qty: c.qty + qty }
              : c
          )
        );
      } else {
        this.cart.set([
          ...this.cart(),
          {
            productId: product.productId,
            name: product.productName,
            price: product.price,
            qty
          }
        ]);
      }

      this.snack.open(
        `${product.productName} added to cart`,
        'OK',
        { duration: 2500, panelClass: ['toast-success'] }
      );
    });
  }

  increase(item: any) {
    const product = this.allProducts.find(p => p.productId === item.productId);
    if (!product || item.qty + 1 > product.stock) {
      this.snack.open(`Only ${product.stock} units available`, 'Close', {
        duration: 3000, panelClass: ['toast-error']
      });
      return;
    }

    this.cart.set(
      this.cart().map(c =>
        c.productId === item.productId
          ? { ...c, qty: c.qty + 1 }
          : c
      )
    );
  }

  decrease(item: any) {
    if (item.qty > 1) {
      this.cart.set(
        this.cart().map(c =>
          c.productId === item.productId
            ? { ...c, qty: c.qty - 1 }
            : c
        )
      );
    } else {
      this.remove(item);
    }
  }

  remove(item: any) {
    this.cart.set(this.cart().filter(c => c.productId !== item.productId));
  }

  totalAmount = computed(() =>
    this.cart().reduce((s, i) => s + i.price * i.qty, 0)
  );

  /* ================= PLACE ORDER ================= */
  placeOrder() {
    if (!this.selectedCustomerEmail || !this.selectedWarehouseId || this.cart().length === 0) {
      this.snack.open(
        'Select customer, warehouse and add products',
        'Close',
        { duration: 3000, panelClass: ['toast-error'] }
      );
      return;
    }

    const ref = this.dialog.open(PaymentDialogComponent, {
      width: '420px',
      data: { cart: this.cart(), total: this.totalAmount() }
    });

    ref.afterClosed().subscribe(confirm => {
      if (!confirm) return;

      const payload = {
        customerEmail: this.selectedCustomerEmail,
        warehouseId: this.selectedWarehouseId,
        orderItems: this.cart().map(i => ({
          productId: i.productId,
          quantity: i.qty
        }))
      };

      this.service.placeOrder(payload).subscribe({
        next: () => {
          this.snack.open('Order placed successfully', 'OK', {
            duration: 3000, panelClass: ['toast-success']
          });
          this.cart.set([]);
          this.onWarehouseChange(this.selectedWarehouseId);
        },
        error: () => {
          this.snack.open('Failed to place order', 'Close', {
            duration: 3000, panelClass: ['toast-error']
          });
        }
      });
    });
  }
}
