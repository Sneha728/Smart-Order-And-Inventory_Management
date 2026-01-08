import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AdminCategoryService } from '../../../../core/services/admin/admin-category-service';
import { ToastService } from '../../../../core/services/toast-service';

@Component({
  selector: 'app-add-edit-category',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './add-edit-category.html',
  styleUrls: ['./add-edit-category.css']
})
export class AddEditCategoryComponent implements OnInit {

  form!: FormGroup;
  categoryId?: number;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: AdminCategoryService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.categoryId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.categoryId;

    this.form = this.fb.group({
      categoryName: ['', Validators.required]
    });

    if (this.isEdit) {
      this.form.patchValue({
        categoryName: history.state?.name
      });
    }
  }

  submit() {
    if (this.form.invalid) return;

    const api = this.isEdit
      ? this.categoryService.updateCategory(this.categoryId!, this.form.value)
      : this.categoryService.createCategory(this.form.value);

    api.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Category updated' : 'Category created');
        this.router.navigate(['/admin/categories']);
      },
      error: () => this.toast.error('Operation failed')
    });
  }

  cancel() {
    this.router.navigate(['/admin/categories']);
  }
}
