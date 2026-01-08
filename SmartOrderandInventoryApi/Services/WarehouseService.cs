using Microsoft.EntityFrameworkCore;
using SmartOrderandInventoryApi.Data;
using SmartOrderandInventoryApi.DTOs;
using SmartOrderandInventoryApi.Models;
using SmartOrderandInventoryApi.Services.Interfaces;

namespace SmartOrderandInventoryApi.Services
{
    public class WarehouseService : IWarehouseService
    {
        private readonly ApplicationDbContext _context;

        public WarehouseService(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET ALL WAREHOUSES
        public async Task<IEnumerable<object>> GetAllAsync()
        {
            return await _context.Warehouses
                .Select(w => new
                {
                    w.WarehouseId,
                    w.WarehouseName,
                    w.Location
                })
                .ToListAsync();
        }

        public async Task<List<object>> GetWarehouseOrdersAsync()
        {
            return await _context.Orders
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    o.OrderId,
                    o.OrderDate,
                    o.Status
                })
                .Cast<object>()
                .ToListAsync();
        }
        public async Task CreateAsync(WarehouseDto dto)
        {
            var warehouse = new Warehouse
            {
                WarehouseName = dto.WarehouseName,
                Location = dto.Location
            };

            _context.Warehouses.Add(warehouse);
            await _context.SaveChangesAsync();

           
            var products = await _context.Products.ToListAsync();

            foreach (var product in products)
            {
                _context.Inventories.Add(new Inventory
                {
                    ProductId = product.ProductId,
                    WarehouseId = warehouse.WarehouseId,
                    Quantity = 0,
                    LastUpdated = DateTime.UtcNow
                });
            }

            await _context.SaveChangesAsync();
        }

        public async Task<List<object>> GetProductsByWarehouseAsync(int warehouseId)
        {
            return await _context.Inventories
                .Where(i => i.WarehouseId == warehouseId && i.Quantity > 0)
                .Include(i => i.Product)
                .Select(i => new
                {
                    i.ProductId,
                    ProductName = i.Product.ProductName,
                    Price = i.Product.Price,
                    Stock = i.Quantity
                })
                .Cast<object>()
                .ToListAsync();
        }
        public async Task<List<object>> GetOrdersByWarehouseAsync(int warehouseId)
        {
            return await _context.Orders
                .Where(o => o.WarehouseId == warehouseId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    o.OrderId,
                    o.OrderDate,
                    o.Status,
                    WarehouseName = o.Warehouse.WarehouseName
                })
                .Cast<object>()
                .ToListAsync();
        }


    }
}
