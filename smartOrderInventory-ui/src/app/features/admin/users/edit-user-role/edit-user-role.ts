import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { AdminUserService } from '../../../../core/services/admin/admin-user-service';
import { ToastService } from '../../../../core/services/toast-service';

@Component({
  selector: 'app-edit-user-role',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './edit-user-role.html',
  styleUrls: ['./edit-user-role.css']
})
export class EditUserRoleComponent implements OnInit {

  userId!: string;
  userEmail!: string;
  currentRole!: string;

  form!: FormGroup;

  allRoles = ['Admin', 'Customer', 'SalesExecutive', 'WarehouseManager', 'FinanceOfficer'];
  availableRoles: string[] = [];

  warehouses: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private adminUserService: AdminUserService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id')!;

    const state = history.state;

    this.userEmail = state?.email;
    this.currentRole = state?.role;

    if (!this.userEmail || !this.currentRole) {
      this.router.navigate(['/admin/users']);
      return;
    }

    // Remove current role from dropdown
    this.availableRoles = this.allRoles.filter(r => r !== this.currentRole);

    this.form = this.fb.group({
      role: ['', Validators.required],
      warehouseId: ['']
    });

    // Load warehouses (needed only for WarehouseManager)
    this.adminUserService.getWarehouses().subscribe(res => {
      this.warehouses = res;
    });

    // Role change logic
    this.form.get('role')!.valueChanges.subscribe(role => {
      if (role === 'WarehouseManager') {
        this.form.get('warehouseId')!.setValidators(Validators.required);
      } else {
        this.form.get('warehouseId')!.clearValidators();
        this.form.get('warehouseId')!.setValue(null);
      }
      this.form.get('warehouseId')!.updateValueAndValidity();
    });
  }

  save(): void {
    if (this.form.invalid) return;

    const payload: any = {
      email: this.userEmail,
      password: 'Temp@123', // backend requirement
      role: this.form.value.role
    };

    if (payload.role === 'WarehouseManager') {
      payload.warehouseId = this.form.value.warehouseId;
    }

    this.adminUserService.updateRole(this.userId, payload).subscribe({
      next: () => {
        this.toast.success('Role updated successfully');
        this.router.navigate(['/admin/users']);
      },
      error: () => {
        this.toast.error('Failed to update role');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/users']);
  }
}
