using SmartOrderandInventoryApi.DTOs;

namespace SmartOrderandInventoryApi.Services.Interfaces
{
    public interface IWarehouseService
    {
        Task<IEnumerable<object>> GetAllAsync();
        Task<List<object>> GetWarehouseOrdersAsync();
        Task CreateAsync(WarehouseDto dto);
        Task<List<object>> GetProductsByWarehouseAsync(int warehouseId);
        Task<List<object>> GetOrdersByWarehouseAsync(int warehouseId);

    }
}
