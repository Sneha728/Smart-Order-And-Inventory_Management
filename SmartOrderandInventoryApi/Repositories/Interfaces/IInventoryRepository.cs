using SmartOrderandInventoryApi.Models;

namespace SmartOrderandInventoryApi.Repositories.Interfaces
{
    public interface IInventoryRepository
    {
        Task<IEnumerable<Inventory>> GetAllAsync(int? warehouseId);
        
        Task<Inventory?> GetByProductAndWarehouseAsync(int productId,int warehouseId);
        Task UpdateAsync(Inventory inventory);
        Task<IEnumerable<Inventory>> GetLowStockAsync(int threshold, int? warehouseId);

        Task CreateAsync(Inventory inventory);


    }
}
