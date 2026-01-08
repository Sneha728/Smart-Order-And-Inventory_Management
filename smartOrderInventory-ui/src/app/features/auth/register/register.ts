import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router,RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../../core/services/auth-service';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {

  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) return;

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.toast.success('Account created successfully');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toast.error(
          err?.error?.message || 'Registration failed'
        );
      }
    });
  }
}
