using SmartOrderandInventoryApi.DTOs;

namespace SmartOrderandInventoryApi.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<List<object>> GetAllCategoriesAsync();
        Task<object> GetCategoryByIdAsync(int id);
        Task CreateCategoryAsync(CategoryDto dto);
        Task UpdateCategoryAsync(int id, CategoryDto dto);
        Task UpdateCategoryStatusAsync(int id, CategoryDto dto);
        Task DeactivateCategoryAsync(int id);
    }
}
