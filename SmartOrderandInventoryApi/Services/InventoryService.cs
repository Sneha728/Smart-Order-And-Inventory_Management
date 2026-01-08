using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SmartOrderandInventoryApi.Data;
using SmartOrderandInventoryApi.DTOs;
using SmartOrderandInventoryApi.Models;
using SmartOrderandInventoryApi.Notifications;
using SmartOrderandInventoryApi.Repositories.Interfaces;
using SmartOrderandInventoryApi.Services.Interfaces;

namespace SmartOrderandInventoryApi.Services
{
    public class InventoryService : IInventoryService
    {
        private readonly IInventoryRepository _repository;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public InventoryService(
            IInventoryRepository repository,
            IConfiguration configuration,ApplicationDbContext context)
        {
            _repository = repository;
            _configuration = configuration;
            _context = context;
        }

        // VIEW INVENTORY
        public async Task<IEnumerable<InventoryResponseDto>> GetAllAsync(
            int? warehouseId,
            string role)
        {
           
            if (role == "Admin")
                warehouseId = null;

            var inventories = await _repository.GetAllAsync(warehouseId);

            return inventories.Select(i => new InventoryResponseDto
            {
                ProductId = i.ProductId,
                ProductName = i.Product.ProductName,
                Quantity = i.Quantity,
                LastUpdated = ToIst(i.LastUpdated)
            });
        }

        //  UPDATE STOCK (Warehouse Manager only)
        public async Task UpdateStockAsync(InventoryDto dto, int warehouseId)
        {
            var productExists = await _context.Products
                .AnyAsync(p => p.ProductId == dto.ProductId);

            if (!productExists)
                throw new Exception("Invalid ProductId");

            var warehouseExists = await _context.Warehouses
                .AnyAsync(w => w.WarehouseId == warehouseId);

            if (!warehouseExists)
                throw new Exception("Invalid WarehouseId");

            var inventory = await _context.Inventories
                .FirstOrDefaultAsync(i =>
                    i.ProductId == dto.ProductId &&
                    i.WarehouseId == warehouseId);

            if (inventory == null)
            {
                inventory = new Inventory
                {
                    ProductId = dto.ProductId,
                    WarehouseId = warehouseId,
                    Quantity = dto.Quantity,          
                    LastUpdated = DateTime.UtcNow
                };

                _context.Inventories.Add(inventory);
            }
            else
            {
                inventory.Quantity += dto.Quantity; 
                inventory.LastUpdated = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            // LOW STOCK ALERT
            if (inventory.Quantity <= 5)
            {
                await NotificationQueue.Channel.Writer.WriteAsync(
                    new NotificationEvent
                    {
                        Title = "Low Stock Alert",
                        Message = $"Product {dto.ProductId} is low in stock ({inventory.Quantity})",
                        UserRole = "WarehouseManager",
                        //TargetUserId = warehouseId,
                        ReferenceId = dto.ProductId.ToString()
                    });
            }
        }





        // LOW STOCK
        public async Task<IEnumerable<LowStockDto>> GetLowStockAsync(
            int? warehouseId,
            string role)
        {
            int threshold = _configuration
                .GetValue<int>("InventorySettings:LowStockThreshold");

            if (role == "Admin")
                warehouseId = null;

            var inventories = await _repository
                .GetLowStockAsync(threshold, warehouseId);

            return inventories.Select(i => new LowStockDto
            {
                ProductId = i.ProductId,
                ProductName = i.Product.ProductName,
                Quantity = i.Quantity
            });
        }

        private static string ToIst(DateTime utc) =>
           TimeZoneInfo.ConvertTimeFromUtc(
               utc,
               TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"))
           .ToString("dd-MMM-yyyy hh:mm tt 'IST'");
    }
}
