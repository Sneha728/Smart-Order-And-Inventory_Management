using SmartOrderandInventoryApi.DTOs;
using SmartOrderandInventoryApi.Repositories.Interfaces;
using SmartOrderandInventoryApi.Services.Interfaces;

namespace SmartOrderandInventoryApi.Services
{
    public class ReportService : IReportService
    {
        private readonly IReportRepository _repo;

        public ReportService(IReportRepository repo)
        {
            _repo = repo;
        }

        public async Task<DashboardSummaryDto> GetDashboardAsync(string role, int? warehouseId)
        {
            if (role == "SalesExecutive")
            {
                return new DashboardSummaryDto
                {
                    TotalOrders = await _repo.GetOrderCountAsync(null, null),
                    CreatedOrders = await _repo.GetOrderCountAsync("Created", null),
                    ShippedOrders = await _repo.GetOrderCountAsync("Shipped", null),
                    DeliveredOrders = await _repo.GetOrderCountAsync("Delivered", null),
                    TotalSales = await _repo.GetTotalSalesAsync()
                };
            }

            // Warehouse Manager
            return new DashboardSummaryDto
            {
                TotalOrders = await _repo.GetOrderCountAsync(null, warehouseId),
                CreatedOrders = await _repo.GetOrderCountAsync("Created", warehouseId),
                ShippedOrders = await _repo.GetOrderCountAsync("Shipped", warehouseId),
                DeliveredOrders = await _repo.GetOrderCountAsync("Delivered", warehouseId),
                LowStockCount = await _repo.GetLowStockCountAsync(5, warehouseId)
            };
        }

        public async Task<IEnumerable<TopSellingProductDto>> GetTopProductsAsync()
            => await _repo.GetTopSellingProductsAsync();

        public async Task<IEnumerable<InventoryStatusDto>> GetInventoryStatusAsync(int warehouseId)
            => await _repo.GetInventoryStatusAsync(warehouseId);
    }
}
