import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <h2 mat-dialog-title>Add to Cart</h2>

    <mat-dialog-content class="dialog-content">
      <p class="product-name">
        <strong>{{ data.product.productName }}</strong>
      </p>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Quantity</mat-label>

        <input
          matInput
          type="number"
          min="1"
          [max]="data.maxQty"
          [(ngModel)]="qty"
          (ngModelChange)="validateQty()"
        />

        <mat-hint>
          Available stock: {{ data.maxQty }}
        </mat-hint>

        <mat-error *ngIf="error">
          {{ error }}
        </mat-error>
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>

      <button
        mat-raised-button
        color="primary"
        [mat-dialog-close]="qty"
        [disabled]="!!error || qty < 1">
        Add
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-content {
      padding-top: 8px;
    }

    .full-width {
      width: 100%;
    }

    .product-name {
      margin-bottom: 12px;
    }
  `]
})
export class AddToCartDialogComponent {

  qty = 1;
  error: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      product: any;
      maxQty: number;
    }
  ) {}

  validateQty() {
    if (this.qty > this.data.maxQty) {
      this.error = `Only ${this.data.maxQty} units available`;
    } else if (this.qty < 1) {
      this.error = 'Quantity must be at least 1';
    } else {
      this.error = null;
    }
  }
}
