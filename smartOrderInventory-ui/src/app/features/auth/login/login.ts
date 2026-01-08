import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,              // ✅ REQUIRED
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule          // ✅ for toast
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  errorMessage = '';
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        const role = this.authService.getUserRole();

        // ✅ SUCCESS TOAST
        this.snackBar.open('Login successful', '✔', {
          duration: 2500,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['toast-success']
        });

        // ✅ ROLE BASED REDIRECT
if (role === 'Admin') {
        this.router.navigate(['/admin']);
      } 
      else if (role === 'WarehouseManager') {
        this.router.navigate(['/warehouse']);
      } 
      else if (role === 'SalesExecutive') {
        this.router.navigate(['/sales']);
      } 
      else if (role === 'FinanceOfficer') {
        this.router.navigate(['/finance']);
      } 
      else if (role === 'Customer') {
        this.router.navigate(['/customer']);
      }else{
        this.router.navigate(['/login']);
      }

    },

      
      error: () => {
        // ✅ ERROR TOAST
        this.snackBar.open('Invalid email or password', '✖', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['toast-error']
        });
      }
    });
  }
}
