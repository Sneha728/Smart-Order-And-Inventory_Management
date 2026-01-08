using SmartOrderandInventoryApi.DTOs;

namespace SmartOrderandInventoryApi.Services.Interfaces
{
    public interface IReportService
    {
        Task<DashboardSummaryDto> GetDashboardAsync(string role, int? warehouseId);
        Task<IEnumerable<TopSellingProductDto>> GetTopProductsAsync();
        Task<IEnumerable<InventoryStatusDto>> GetInventoryStatusAsync(int warehouseId);
    }

}
