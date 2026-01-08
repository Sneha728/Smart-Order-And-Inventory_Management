import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [MatDialogModule, MatButtonModule,CommonModule],
  template: `
    <h2 mat-dialog-title>Confirm Payment</h2>

    <mat-dialog-content>
      <div *ngFor="let i of data.cart">
        {{ i.name }} × {{ i.qty }} = ₹{{ i.price * i.qty }}
      </div>

      <hr>
      <strong>Total: ₹{{ data.total }}</strong>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="true">
        place Order
      </button>
    </mat-dialog-actions>
  `
})
export class PaymentDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
