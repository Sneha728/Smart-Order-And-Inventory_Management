using SmartOrderandInventoryApi.DTOs;

namespace SmartOrderandInventoryApi.Services.Interfaces
{
    public interface IInventoryService
    {
        Task<IEnumerable<InventoryResponseDto>> GetAllAsync(int? warehouseId, string role);
        Task UpdateStockAsync(InventoryDto dto , int warehouseId);
        Task<IEnumerable<LowStockDto>> GetLowStockAsync(int? warehouseId, string role);

    }
}
