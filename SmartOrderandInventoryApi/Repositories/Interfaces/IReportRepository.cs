using SmartOrderandInventoryApi.DTOs;

namespace SmartOrderandInventoryApi.Repositories.Interfaces
{
    public interface IReportRepository
    {
        Task<int> GetOrderCountAsync(string status, int? warehouseId);
        Task<decimal> GetTotalSalesAsync();
        Task<int> GetLowStockCountAsync(int threshold, int? warehouseId);
        Task<IEnumerable<TopSellingProductDto>> GetTopSellingProductsAsync();
        Task<IEnumerable<InventoryStatusDto>> GetInventoryStatusAsync(int warehouseId);
    }

}
