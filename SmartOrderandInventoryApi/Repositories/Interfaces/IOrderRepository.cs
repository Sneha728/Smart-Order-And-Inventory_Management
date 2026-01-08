using SmartOrderandInventoryApi.Models;

namespace SmartOrderandInventoryApi.Repositories.Interfaces
{
    public interface IOrderRepository
    {
        Task AddAsync(Order order);
        Task<Order?> GetByIdAsync(int id);
        Task<List<Order>> GetWarehouseOrdersAsync();
        Task<IQueryable<Order>> GetQueryableAsync();
        Task SaveAsync();
    }
}
