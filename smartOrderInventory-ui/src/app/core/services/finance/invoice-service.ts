import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private invoiceUrl = `${environment.apiUrl}/invoices`;
  private paymentUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  /* ================= FINANCE ================= */
  getAllInvoices(): Observable<any[]> {
    return this.http.get<any[]>(this.invoiceUrl);
  }

  /* ================= CUSTOMER ================= */
  getMyInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.invoiceUrl}/my`);
  }

  /* ================= SALES EXECUTIVE ================= */
  getSalesInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.invoiceUrl}/my`);
  }

  /* ================= PAY INVOICE ================= */
  payInvoice(invoice: any) {
    return this.http.post(
      `${this.paymentUrl}/pay`,
      {
        invoiceId: invoice.invoiceId,
        amount: invoice.totalAmount,
        paymentMethod: 'UPI'
      },
      { responseType: 'text' }
    );
  }

  /* ================= REPORTS ================= */
  getTopSellingProducts(): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.apiUrl}/reports/top-products`
    );
  }
}
