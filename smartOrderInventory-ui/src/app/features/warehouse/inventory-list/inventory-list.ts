import { Component, OnInit, ViewChild , AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { WarehouseInventoryService } from '../../../core/services/warehouse/warehouse-inventory-service';
import { ToastService } from '../../../core/services/toast-service';
import { AddStockDialogComponent } from '../add-stock-dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  standalone: true,
  selector: 'app-inventory-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSortModule
  ],
  templateUrl: './inventory-list.html',
  styleUrls: ['./inventory-list.css']
})
export class InventoryListComponent implements OnInit ,AfterViewInit{

  displayedColumns = ['product',  'stock', 'updated', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private inventoryService: WarehouseInventoryService,
    private toast: ToastService,
    private dialog: MatDialog,
    
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  }
  ngAfterViewInit(): void {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}


  loadInventory() {
    this.inventoryService.getInventory().subscribe({
      next: (res) => {
        this.dataSource.data = res.map(i => ({
          productId: i.productId,
          productName: i.productName,
           
          stock: i.quantity,
          lastUpdated: i.lastUpdated             
        }));
        this.dataSource.sortingDataAccessor = (item, property) => {
          if (property === 'product') {
            const name = item.productName;
            const isUpper = name[0] === name[0].toUpperCase() ? 1 : 0;
            return `${name.toLowerCase()}_${isUpper}_${name}`;
          }
          return item[property];
        };

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => this.toast.error('Failed to load inventory')
    });
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

addStock(row: any) {
  const dialogRef = this.dialog.open(AddStockDialogComponent, {
    width: '350px',
    data: { mode: 'add' }
  });

  dialogRef.afterClosed().subscribe(qty => {
    if (!qty) return;

    this.inventoryService.updateStock({
      productId: row.productId,
      quantity: qty
    }).subscribe({
      next: () => {
        this.toast.success('Stock added successfully');
        this.loadInventory();
      },
      error: () => this.toast.error('Failed to add stock')
    });
  });
}

reduceStock(row: any) {
  const dialogRef = this.dialog.open(AddStockDialogComponent, {
    width: '350px',
    data: { mode: 'reduce' }
  });

  dialogRef.afterClosed().subscribe(qty => {
    if (!qty) return;

    if (qty > row.stock) {
      this.toast.error('Cannot reduce more than available stock');
      return;
    }

    this.inventoryService.updateStock({
      productId: row.productId,
      quantity: -qty   
    }).subscribe({
      next: () => {
        this.toast.success('Stock reduced successfully');
        this.loadInventory();
      },
      error: () => this.toast.error('Failed to reduce stock')
    });
  });
}}
