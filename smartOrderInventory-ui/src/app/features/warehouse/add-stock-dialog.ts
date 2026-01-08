import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-add-stock-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      {{ data.mode === 'add' ? 'Add Stock' : 'Reduce Stock' }}
    </h2>

    <form [formGroup]="form" mat-dialog-content class="dialog-content">
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Quantity</mat-label>
        <input
          matInput
          type="number"
          formControlName="quantity"
          min="1"
          autocomplete="off"
        />
        <mat-error *ngIf="form.controls['quantity'].invalid">
          Enter a valid quantity
        </mat-error>
      </mat-form-field>
    </form>

    <mat-dialog-actions class="dialog-actions">
      <button mat-button class="cancel-btn" (click)="close()">
        Cancel
      </button>

      <button
        mat-raised-button
        color="primary"
        class="action-btn"
        [disabled]="form.invalid"
        (click)="submit()">
        {{ data.mode === 'add' ? 'Add' : 'Reduce' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title {
      padding: 16px 24px 8px;
      font-weight: 600;
    }

    .dialog-content {
      padding: 16px 24px 4px;
    }

    .full-width {
      width: 100%;
    }

    mat-form-field {
      margin-top: 12px;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px 20px;
    }

    .cancel-btn {
      color: #7b1fa2;
    }

    .action-btn {
      min-width: 90px;
    }
  `]
})
export class AddStockDialogComponent {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddStockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'reduce' }
  ) {
    this.form = this.fb.group({
      quantity: [null, [Validators.required, Validators.min(1)]]
    });
  }

  submit() {
    this.dialogRef.close(this.form.value.quantity);
  }

  close() {
    this.dialogRef.close();
  }
}
