using SmartOrderandInventoryApi.Models;

namespace SmartOrderandInventoryApi.Repositories.Interfaces
{
    public interface IWarehouseRepository
    {
        Task<IEnumerable<Warehouse>> GetAllAsync();
        Task AddAsync(Warehouse warehouse);
        Task SaveAsync();
    }
}
