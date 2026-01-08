using SmartOrderandInventoryApi.DTOs;

namespace SmartOrderandInventoryApi.Services.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<object>> GetAllAsync();
        Task<object?> GetProductAsync(int id);
        Task CreateProductAsync(ProductDto dto);
        Task UpdateProductAsync(int id, ProductDto dto);
        Task UpdateProductStatusAsync(int id, ProductDto dto);
        Task DeleteProductAsync(int id);
    }
}
