import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AdminUserService } from '../../../../core/services/admin/admin-user-service';
import { ToastService } from '../../../../core/services/toast-service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSnackBarModule
    
  ],
  templateUrl: './add-user.html',
  styleUrls: ['./add-user.css']
})
export class AddUserComponent implements OnInit {

  roles = ['Admin', 'SalesExecutive', 'WarehouseManager', 'FinanceOfficer', 'Customer'];
  warehouses: any[] = [];

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminUserService: AdminUserService,
    private router: Router,
      private snackBar: MatSnackBar

  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
      warehouseId: [null]   
    });

    this.loadWarehouses();

   
    this.form.get('role')?.valueChanges.subscribe(role => {
      if (role === 'WarehouseManager') {
        this.form.get('warehouseId')?.setValidators(Validators.required);
      } else {
        this.form.get('warehouseId')?.clearValidators();
        this.form.get('warehouseId')?.setValue(null);
      }
      this.form.get('warehouseId')?.updateValueAndValidity();
    });
  }

  loadWarehouses() {
    this.adminUserService.getWarehouses().subscribe({
      next: res => this.warehouses = res
    });
  }

submit() {
  if (this.form.invalid) return;

  const payload: any = {
    email: this.form.value.email,
    password: this.form.value.password,
    role: this.form.value.role
  };

  // Only for WarehouseManager
  if (this.form.value.role === 'WarehouseManager') {
    payload.warehouseId = this.form.value.warehouseId;
  }

  this.adminUserService.createUser(payload).subscribe({
    next: () => {
      this.snackBar.open('User created successfully', '✔', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['toast-success']
      });

      this.router.navigate(['/admin/users']);
    },
    error: (err) => {
      this.snackBar.open(
        err?.error?.message || ' Failed to create user',
        '✖',
        {
          duration: 4000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['toast-error']
        }
      );
    }
  });
}



  cancel() {
    this.router.navigate(['/admin/users']);
  }
}
