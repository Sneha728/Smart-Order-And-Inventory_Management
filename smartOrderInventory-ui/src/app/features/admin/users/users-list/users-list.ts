import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AdminUserService } from '../../../../core/services/admin/admin-user-service';
import { AuthService } from '../../../../core/services/auth-service';
import { ToastService } from '../../../../core/services/toast-service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './users-list.html',
  styleUrls: ['./users-list.css']
})
export class UserListComponent implements OnInit {

  displayedColumns: string[] = ['email', 'role', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  loggedInAdminEmail = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private adminUserService: AdminUserService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loggedInAdminEmail = this.authService.getUserEmail() || '';
    this.loadUsers();
  }

  loadUsers() {
    this.adminUserService.getUsers().subscribe({
      next: (res: any[]) => {
        this.dataSource.data = res.map(user => ({
          id: user.id,
          email: user.email,
          role: user.roles?.[0] || 'Customer',
          active: !user.lockoutEnabled   // BACKEND → UI mapping
        }));

        this.dataSource.paginator = this.paginator;
      }
    });
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  toggleStatus(user: any) {
    if (!this.canEditUser(user)) return;

    this.adminUserService.toggleStatus(user.id, !user.active)
      .subscribe(() => {
        user.active = !user.active;
      });
  }

  addUser() {
    this.router.navigate(['/admin/users/add']);
  }

  editRole(user: any) {
  this.router.navigate(
    ['/admin/users', user.id, 'edit-role'],
    { state: { email: user.email, role: user.role} }
  );
}

deleteUser(user: any) {

  // Prevent admin from deleting himself
  if (!this.canEditUser(user)) {
    return;
  }

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '380px',
    disableClose: true,
    data: {
      title: 'Delete User',
      message: `Are you sure you want to delete "${user.email}"?`
    }
  });

  dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    if (!confirmed) return;

    this.adminUserService.deleteUser(user.id).subscribe({
      next: () => {
      
        this.dataSource.data = this.dataSource.data.filter(
          u => u.id !== user.id
        );

        this.snackBar.open('User deleted successfully', '✔', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['toast-success']
        });
      },
      error: () => {
        this.snackBar.open(' Failed to delete user', '✖', {
          duration: 4000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['toast-error']
        });
      }
    });
  });
}




  canEditUser(user: any): boolean {
  // Block actions for Admin role
  if (user.role === 'Admin') {
    return false;
  }

  // Block logged-in admin editing self (extra safety)
  return user.email !== this.loggedInAdminEmail;
}



}
