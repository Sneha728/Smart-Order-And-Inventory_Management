
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { InvoiceService } from '../../../core/services/finance/invoice-service';

@Component({
  selector: 'app-finance-invoices',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './finance-invoice.html',
  styleUrls: ['./finance-invoice.css']
})
export class FinanceInvoicesComponent implements OnInit {

  displayedColumns: string[] = [
    'invoiceId',
    'orderId',
    'invoiceDate',
    'totalAmount',
    'paymentStatus'
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: InvoiceService) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices() {
    this.service.getAllInvoices().subscribe(res => {
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // Filter across invoiceId & orderId
      this.dataSource.filterPredicate = (data, filter) =>
        data.invoiceId.toString().includes(filter) ||
        data.orderId.toString().includes(filter);
    });
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim();
  }
}


