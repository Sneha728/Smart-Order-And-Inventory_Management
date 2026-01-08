using Microsoft.EntityFrameworkCore;
using SmartOrderandInventoryApi.Data;
using SmartOrderandInventoryApi.Models;
using SmartOrderandInventoryApi.Repositories.Interfaces;

namespace SmartOrderandInventoryApi.Repositories
{
    public class InventoryRepository : IInventoryRepository
    {
        private readonly ApplicationDbContext _context;

        public InventoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Inventory>> GetAllAsync(int? warehouseId = null)
        {
            var query = _context.Inventories
                .Include(i => i.Product)
                .AsQueryable();

            if (warehouseId.HasValue)
                query = query.Where(i => i.WarehouseId == warehouseId.Value);

            return await query.ToListAsync();
        }

        public async Task<Inventory?> GetByProductAndWarehouseAsync(
            int productId,
            int warehouseId)
        {
            return await _context.Inventories
                .Include(i => i.Product)
                .FirstOrDefaultAsync(i =>
                    i.ProductId == productId &&
                    i.WarehouseId == warehouseId);
        }

        public async Task UpdateAsync(Inventory inventory)
        {
            inventory.LastUpdated = DateTime.UtcNow;
            _context.Inventories.Update(inventory);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Inventory>> GetLowStockAsync(
            int threshold,
            int? warehouseId = null)
        {
            var query = _context.Inventories
                .Include(i => i.Product)
                .Where(i => i.Quantity <= threshold)
                .AsQueryable();

            if (warehouseId.HasValue)
                query = query.Where(i => i.WarehouseId == warehouseId.Value);

            return await query.ToListAsync();
        }

        public async Task CreateAsync(Inventory inventory)
        {
            _context.Inventories.Add(inventory);
            await _context.SaveChangesAsync();
        }


    }
}
