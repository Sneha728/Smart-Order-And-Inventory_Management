import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AdminProductService } from '../../../../core/services/admin/admin-product-service';
import { ToastService } from '../../../../core/services/toast-service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-products-list',
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
    MatInputModule
  ],
  templateUrl: './products-list.html',
  styleUrls: ['./products-list.css']
})
export class ProductsListComponent implements OnInit {

  displayedColumns = ['name', 'category', 'price','status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: AdminProductService,
    private toast: ToastService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

loadProducts() {
  this.productService.getProducts().subscribe({
    next: (res) => {
      this.dataSource.data = res.map(p => ({
        id: p.productId,
        name: p.productName,
        price: p.price,

        category: p.category,
        categoryId: p.categoryId,
        categoryIsActive: p.categoryIsActive,   

        stock: p.stock ?? 0,                    
        active: p.isActive
      }));

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // lowercase first, then uppercase
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
    error: () => this.toast.error('Failed to load products')
  });
}


  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  addProduct() {
    this.router.navigate(['/admin/products/add']);
  }

  editProduct(p: any) {
    this.router.navigate(
      ['/admin/products/edit', p.id],
      { state: p }
    );
  }

toggleStatus(p: any) {

  //  Category inactive → product cannot be activated
  if (!p.categoryIsActive && !p.active) {
    this.toast.error(
      'Cannot activate product. Category is inactive.'
    );
    return;
  }

  this.productService.toggleProductStatus(p.id).subscribe({
    next: () => {
      p.active = !p.active;
      this.toast.success(
        p.active ? 'Product activated' : 'Product deactivated'
      );
    },
    error: () => this.toast.error('Failed to update product status')
  });
}


deleteProduct(p: any) {

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '380px',
    disableClose: true,
    data: {
      title: 'Delete Product',
      message: `Are you sure you want to permanently delete "${p.name}"?`
    }
  });

  dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    if (!confirmed) return;

    this.productService.deleteProduct(p.id).subscribe({
      next: () => {
        this.toast.success('Product deleted successfully');

        // Remove immediately from table
        this.dataSource.data = this.dataSource.data.filter(
          item => item.id !== p.id
        );
      },
      error: () => {
        this.toast.error('Failed to delete product');
      }
    });
  });
}


}
