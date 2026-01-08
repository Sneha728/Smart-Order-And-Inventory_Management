import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

import { WarehouseDashboardService } from
  '../../../core/services/warehouse/warehouse-dashboard-service';

@Component({
  selector: 'app-dashboards-reports',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './dashboards-reports.html',
  styleUrls: ['./dashboards-reports.css']
})
export class DashboardsReports implements OnInit {

  /* ================= SIGNAL STATE ================= */
  summary = signal<any | null>(null);
  inventory = signal<any[]>([]);

  /* ================= COMPUTED ================= */
  lowStockItems = computed(() =>
    this.inventory().filter(i => i.quantity <= 10)
  );

  topStocked = computed(() =>
    [...this.inventory()]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
  );

  /* ================= ORDER BAR ================= */
  ordersBarType: ChartType = 'bar';

  ordersBarData = signal<ChartConfiguration['data']>({
    labels: ['Created', 'Shipped', 'Delivered'],
    datasets: []
  });

  ordersBarOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { display: false } }
  };

  /* ================= INVENTORY PIE ================= */
  inventoryPieType: ChartType = 'doughnut';

  inventoryPieData = signal<ChartConfiguration['data']>({
    labels: ['Low Stock', 'Healthy Stock'],
    datasets: []
  });

  /* ================= INVENTORY BAR ================= */
  inventoryBarType: ChartType = 'bar';

  inventoryBarData = signal<ChartConfiguration['data']>({
    labels: [],
    datasets: []
  });

  constructor(private service: WarehouseDashboardService) {}

  ngOnInit(): void {
    this.loadDashboard();
    this.loadInventory();
  }

  /* ================= LOAD DASHBOARD ================= */
  loadDashboard() {
    this.service.getDashboard().subscribe(res => {
      this.summary.set(res);

      this.ordersBarData.set({
        labels: ['Created', 'Shipped', 'Delivered'],
        datasets: [{
          data: [
            res.createdOrders,
            res.shippedOrders,
            res.deliveredOrders
          ],
          backgroundColor: ['#ab47bc', '#66bb6a', '#26a69a']
        }]
      });

      this.inventoryPieData.set({
        labels: ['Low Stock', 'Healthy Stock'],
        datasets: [{
          data: [
            res.lowStockCount,
            res.totalOrders - res.lowStockCount
          ],
          backgroundColor: ['#ef5350', '#66bb6a']
        }]
      });
    });
  }

  /* ================= LOAD INVENTORY ================= */
  loadInventory() {
    this.service.getInventoryStatus().subscribe(res => {
      this.inventory.set(res);

      this.inventoryBarData.set({
        labels: res.map(i => i.productName),
        datasets: [{
          label: 'Quantity',
          data: res.map(i => i.quantity),
          backgroundColor: '#42a5f5'
        }]
      });
    });
  }
}
