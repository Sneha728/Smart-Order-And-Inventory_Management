import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { AdminProductService } from '../../../../core/services/admin/admin-product-service';
import { AdminCategoryService } from '../../../../core/services/admin/admin-category-service';
import { ToastService } from '../../../../core/services/toast-service';

@Component({
  selector: 'app-add-edit-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './add-edit-product.html',
  styleUrls: ['./add-edit-product.css']
})
export class AddEditProductComponent implements OnInit {

  form!: FormGroup;
  isEdit = false;
  productId!: number;
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: AdminProductService,
    private categoryService: AdminCategoryService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadCategories();
    this.loadProductIfEdit();
  }

  // ---------- FORM ----------
  private buildForm() {
    this.form = this.fb.group({
      productName: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      categoryId: [null, Validators.required]
    });
  }

  // ---------- LOAD CATEGORIES ----------
  private loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        // only ACTIVE categories selectable
        this.categories = res.filter(c => c.isActive);
      },
      error: () => this.toast.error('Failed to load categories')
    });
  }

  // ---------- EDIT MODE HANDLER ----------
  private loadProductIfEdit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.isEdit = true;
    this.productId = +id;

    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        this.form.patchValue({
          productName: product.productName,
          price: product.price,
          categoryId: product.categoryId
        });
      },
      error: () => {
        this.toast.error('Failed to load product');
        this.router.navigate(['/admin/products']);
      }
    });
  }

  // ---------- SAVE ----------
  submit() {
    if (this.form.invalid) return;

    const payload = this.form.value;

    if (this.isEdit) {
      this.productService.updateProduct(this.productId, payload).subscribe({
        next: () => {
          this.toast.success('Product updated successfully');
          this.router.navigate(['/admin/products']);
        },
        error: () => this.toast.error('Failed to update product')
      });
    } else {
      this.productService.createProduct(payload).subscribe({
        next: () => {
          this.toast.success('Product created successfully');
          this.router.navigate(['/admin/products']);
        },
        error: () => this.toast.error('Failed to create product')
      });
    }
  }

  cancel() {
    this.router.navigate(['/admin/products']);
  }
}
