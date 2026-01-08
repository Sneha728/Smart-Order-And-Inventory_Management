import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { AdminCategoryService } from '../../../../core/services/admin/admin-category-service';
import { ToastService } from '../../../../core/services/toast-service';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule
  ],
  templateUrl: './categories-list.html',
  styleUrls: ['./categories-list.css']
})
export class CategoriesListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private categoryService: AdminCategoryService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.dataSource.data = res.map(c => ({
          id: c.categoryId,
          name: c.categoryName,
          active: c.isActive,
          productCount: c.productCount ?? 0,
          hasProducts: (c.productCount ?? 0) > 0
        }));

        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });

        this.dataSource.sortingDataAccessor = (item, property) => {
          if (property === 'name') {
            const lower = /^[a-z]/.test(item.name);
            return (lower ? '0' : '1') + item.name.toLowerCase();
          }
          return item[property];
        };

        this.sort.active = 'name';
        this.sort.direction = 'asc';
      },
      error: () => this.toast.error('Failed to load categories')
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  addCategory(): void {
    this.router.navigate(['/admin/categories/add']);
  }

  editCategory(category: any): void {
    this.router.navigate(['/admin/categories/edit', category.id], {
      state: { name: category.name }
    });
  }

toggleStatus(category: any, event: MatSlideToggleChange): void {

  //  BLOCK DEACTIVATION IF PRODUCTS EXIST
  if (category.hasProducts && category.active) {

    //  REVERT UI STATE
    event.source.checked = true;

    this.toast.error('Cannot deactivate category with existing products');
    return;
  }

  this.categoryService.toggleCategoryStatus(category.id).subscribe({
    next: () => {
      category.active = !category.active;
      this.toast.success(
        category.active ? 'Category activated' : 'Category deactivated'
      );
    },
    error: () => {
      //  REVERT UI ON ERROR
      event.source.checked = category.active;
      this.toast.error('Failed to update category status');
    }
  });
}

  deleteCategory(category: any): void {

    //  BLOCK DELETE IF PRODUCTS EXIST
    if (category.hasProducts) {
      this.toast.error('Cannot deactivate category with existing products');
      return;
    }

    this.categoryService.deleteCategory(category.id).subscribe({
      next: () => {
        category.active = false;
        this.toast.success('Category deactivated successfully');
      },
      error: (err) => {
        this.toast.error(err?.error || 'Failed to deactivate category');
      }
    });
  }
}
