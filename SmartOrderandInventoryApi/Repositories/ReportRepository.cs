using Microsoft.EntityFrameworkCore;
using SmartOrderandInventoryApi.Data;
using SmartOrderandInventoryApi.DTOs;
using SmartOrderandInventoryApi.Repositories.Interfaces;

namespace SmartOrderandInventoryApi.Repositories
{
    public class ReportRepository : IReportRepository
    {
        private readonly ApplicationDbContext _context;

        public ReportRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> GetOrderCountAsync(string status, int? warehouseId)
        {
            var query = _context.Orders.AsQueryable();

            if (!string.IsNullOrEmpty(status))
                query = query.Where(o => o.Status == status);

            if (warehouseId.HasValue)
                query = query.Where(o => o.WarehouseId == warehouseId);

            return await query.CountAsync();
        }

        public async Task<decimal> GetTotalSalesAsync()
        {
            return await _context.Invoices
                .Where(i => i.PaymentStatus == "Paid")
                .SumAsync(i => i.TotalAmount);
        }

        public async Task<int> GetLowStockCountAsync(int threshold, int? warehouseId)
        {
            var query = _context.Inventories.AsQueryable();

            if (warehouseId.HasValue)
                query = query.Where(i => i.WarehouseId == warehouseId);

            return await query.CountAsync(i => i.Quantity <= threshold);
        }

        // SALES EXEC → TOP PRODUCTS
        public async Task<IEnumerable<TopSellingProductDto>> GetTopSellingProductsAsync()
        {
            return await _context.OrderItems
                .GroupBy(i => i.Product.ProductName)
                .Select(g => new TopSellingProductDto
                {
                    ProductName = g.Key,
                    QuantitySold = g.Sum(x => x.Quantity)
                })
                .OrderByDescending(x => x.QuantitySold)
                .Take(5)
                .ToListAsync();
        }

        // WAREHOUSE → INVENTORY STATUS
        public async Task<IEnumerable<InventoryStatusDto>> GetInventoryStatusAsync(int warehouseId)
        {
            return await _context.Inventories
                .Where(i => i.WarehouseId == warehouseId)
                .Select(i => new InventoryStatusDto
                {
                    ProductName = i.Product.ProductName,
                    Quantity = i.Quantity
                })
                .ToListAsync();
        }
    }

}

