import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

/* Material */
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import { CustomerOrderService } from '../../../core/services/customer/customer-order-service';
import { AddToCartDialogComponent } from '../add-to-cart-dialog';
import { PaymentDialogComponent } from '../payment-dialog';


@Component({
  selector: 'app-place-order',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    
  ],
  templateUrl: './place-order.html',
  styleUrls: ['./place-order.css']
})
export class PlaceOrderComponent implements OnInit {

  warehouses: any[] = [];

  // ✅ SIGNALS
  products = signal<any[]>([]);
  cart = signal<any[]>([]);

  selectedWarehouseId!: number;

  productColumns = ['product', 'price', 'action'];
  cartColumns = ['product', 'qty', 'subtotal', 'action'];
  

  constructor(
    private service: CustomerOrderService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadWarehouses();
  }

  loadWarehouses() {
    this.service.getWarehouses().subscribe(res => {
      this.warehouses = res;
    });
  }

  // ================= LOAD PRODUCTS =================
  onWarehouseChange() {
    if (!this.selectedWarehouseId) return;

    this.cart.set([]);

    this.service.getProductsByWarehouse(this.selectedWarehouseId).subscribe({
      next: res => {
        this.products.set(res.filter(p => p.stock > 0));
      },
      error: () => {
        this.snack.open(
          'Failed to load products for warehouse',
          'Close',
          { duration: 3000, panelClass: ['toast-error'] }
        );
      }
    });
  }

  // ================= COMPUTED =================
  isCartEmpty = computed(() => this.cart().length === 0);

  noProductsAvailable = computed(() =>
    !!this.selectedWarehouseId && this.products().length === 0
  );

  totalAmount = computed(() =>
    this.cart().reduce((s, i) => s + i.price * i.qty, 0)
  );

// ================= ADD TO CART =================
addToCart(product: any) {


  if (!this.selectedWarehouseId) {
    this.snack.open(
      'Please select a warehouse first',
      'Close',
      { duration: 3000, panelClass: ['toast-error'] }
    );
    return;
  }


  if (product.stock <= 0) {
    this.snack.open(
      `${product.productName} is out of stock`,
      'Close',
      { duration: 3000, panelClass: ['toast-error'] }
    );
    return;
  }

 
  const existing = this.cart().find(
    c => c.productId === product.productId
  );

  const alreadyInCartQty = existing?.qty ?? 0;
  const remainingStock = product.stock - alreadyInCartQty;

  if (remainingStock <= 0) {
    this.snack.open(
      `Only ${product.stock} units available`,
      'Close',
      { duration: 3000, panelClass: ['toast-error'] }
    );
    return;
  }

 
  const dialogRef = this.dialog.open(AddToCartDialogComponent, {
    width: '360px',
    data: {
      product,
      maxQty: remainingStock   
    }
  });


  dialogRef.afterClosed().subscribe(qty => {
    if (!qty || qty <= 0) return;

   
    if (qty > remainingStock) {
      this.snack.open(
        `Only ${remainingStock} units available`,
        'Close',
        { duration: 4000, panelClass: ['toast-error'] }
      );
      return;
    }

    const currentCart = this.cart();

    if (existing) {
      this.cart.set(
        currentCart.map(c =>
          c.productId === product.productId
            ? { ...c, qty: c.qty + qty }
            : c
        )
      );
    } else {
      this.cart.set([
        ...currentCart,
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
    const product = this.products().find(p => p.productId === item.productId);
    if (!product) return;

    if (item.qty + 1 > product.stock) {
      this.snack.open(
        `Only ${product.stock} units available`,
        'Close',
        { duration: 3000, panelClass: ['toast-error'] }
      );
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
    this.cart.set(
      this.cart().filter(c => c.productId !== item.productId)
    );

    this.snack.open(
      `${item.name} removed from cart`,
      'OK',
      { duration: 2500, panelClass: ['toast-success'] }
    );
  }

  // ================= PLACE ORDER =================
  placeOrder() {
    if (!this.selectedWarehouseId || this.cart().length === 0) {
      this.snack.open(
        'Select warehouse & add products',
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
        warehouseId: this.selectedWarehouseId,
        orderItems: this.cart().map(i => ({
          productId: i.productId,
          quantity: i.qty
        }))
      };

      this.service.placeOrder(payload).subscribe({
        next: () => {
          this.snack.open(
            'Order placed successfully',
            'OK',
            { duration: 3000, panelClass: ['toast-success'] }
          );
          this.cart.set([]);
          this.onWarehouseChange();
        },
        error: () => {
          this.snack.open(
            'Failed to place order',
            'Close',
            { duration: 3000, panelClass: ['toast-error'] }
          );
        }
      });
    });
  }
}
