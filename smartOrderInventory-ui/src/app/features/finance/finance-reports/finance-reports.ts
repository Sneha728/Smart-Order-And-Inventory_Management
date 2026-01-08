import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { InvoiceService } from '../../../core/services/finance/invoice-service';

@Component({
  selector: 'app-finance-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './finance-reports.html',
  styleUrls: ['./finance-reports.css']
})
export class FinanceReports implements OnInit {

  /* ================= FILTER STATE ================= */
  fromDate = signal('');
  toDate = signal('');

  invoices = signal<any[]>([]);

  /* ================= SUMMARY ================= */
  totalSales = computed(() =>
    this.invoices().reduce((s, i) => s + i.totalAmount, 0)
  );

  paidAmount = computed(() =>
    this.invoices()
      .filter(i => i.paymentStatus === 'Paid')
      .reduce((s, i) => s + i.totalAmount, 0)
  );

  pendingAmount = computed(() =>
    this.invoices()
      .filter(i => i.paymentStatus !== 'Paid')
      .reduce((s, i) => s + i.totalAmount, 0)
  );

  /* ================= PAYMENT STATUS ================= */
  paymentChartType: ChartType = 'doughnut';
  paymentChartData: ChartConfiguration['data'] = {
    labels: ['Paid', 'Pending'],
    datasets: [{ data: [0, 0], backgroundColor: ['#66bb6a', '#ef5350'] }]
  };

  /* ================= SALES BY DATE ================= */
  salesDateChartType: ChartType = 'bar';
  salesDateChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{
      label: 'Sales Amount',
      data: [],
      backgroundColor: '#42a5f5'
    }]
  };

  /* ================= SALES BY PRODUCT (QUANTITY) ================= */
  productChartType: ChartType = 'bar';
  productChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{
      label: 'Units Sold',
      data: [],
      backgroundColor: '#26a69a'
    }]
  };

  horizontalBarOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y'
  };

  barOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };

  constructor(private service: InvoiceService) {}

  ngOnInit(): void {
    this.loadInvoices();
    this.loadProductSales();
  }

  /* ================= LOAD INVOICES ================= */
  loadInvoices() {
    this.service.getAllInvoices().subscribe(res => {
      this.invoices.set(res);
      this.buildInvoiceCharts(res);
    });
  }

  applyFilter() {
    this.service.getAllInvoices().subscribe(res => {
      let filtered = res;

      if (this.fromDate()) {
        filtered = filtered.filter(i =>
          new Date(i.invoiceDate) >= new Date(this.fromDate())
        );
      }

      if (this.toDate()) {
        filtered = filtered.filter(i =>
          new Date(i.invoiceDate) <= new Date(this.toDate())
        );
      }

      this.invoices.set(filtered);
      this.buildInvoiceCharts(filtered);
    });
  }

  /* ================= BUILD INVOICE CHARTS ================= */
  buildInvoiceCharts(data: any[]) {

    this.paymentChartData = {
      labels: ['Paid', 'Pending'],
      datasets: [{
        data: [this.paidAmount(), this.pendingAmount()],
        backgroundColor: ['#66bb6a', '#ef5350']
      }]
    };

    const byDate: Record<string, number> = {};
    data.forEach(i => {
      byDate[i.invoiceDate] =
        (byDate[i.invoiceDate] || 0) + i.totalAmount;
    });

    this.salesDateChartData = {
      labels: Object.keys(byDate),
      datasets: [{
        label: 'Sales Amount',
        data: Object.values(byDate),
        backgroundColor: '#42a5f5'
      }]
    };
  }

  /* ================= SALES BY PRODUCT ================= */
  loadProductSales() {
    this.service.getTopSellingProducts().subscribe(res => {
      this.productChartData = {
        labels: res.map(p => p.productName),
        datasets: [{
          label: 'Units Sold',
          data: res.map(p => p.quantitySold),
          backgroundColor: '#26a69a'
        }]
      };
    });
  }
}
