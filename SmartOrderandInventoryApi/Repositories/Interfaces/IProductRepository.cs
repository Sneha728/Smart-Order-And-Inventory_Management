using SmartOrderandInventoryApi.Models;

namespace SmartOrderandInventoryApi.Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(int id);

        Task DeleteAsync(Product product);
        Task AddAsync(Product product);
        Task SaveAsync();
    }
}
