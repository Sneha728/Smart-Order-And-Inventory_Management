import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InvoiceService } from '../../../core/services/finance/invoice-service';

@Component({
  selector: 'app-sales-invoice-billing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-billing.html',
  styleUrls: ['./invoice-billing.css']
})
export class SalesInvoiceBillingComponent implements OnInit {

  invoices = signal<any[]>([]);
  loading = signal<boolean>(true);

  constructor(
    private service: InvoiceService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices() {
    this.loading.set(true);

    // 🔥 SALES-SPECIFIC API
    this.service.getSalesInvoices().subscribe({
      next: res => {
        this.invoices.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.snack.open('Failed to load invoices', 'OK', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  pay(invoice: any) {
    this.service.payInvoice(invoice).subscribe({
      next: () => {
        this.snack.open('Payment successful', 'OK', { duration: 3000 });
        this.loadInvoices();
      },
      error: () => {
        this.snack.open('Payment failed', 'OK', { duration: 3000 });
      }
    });
  }
}
