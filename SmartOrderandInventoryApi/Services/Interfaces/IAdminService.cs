using SmartOrderandInventoryApi.DTOs;

namespace SmartOrderandInventoryApi.Services.Interfaces
{
    public interface IAdminService
    {
        Task<List<object>> GetAllUsersAsync();
        Task<object> GetUserByIdAsync(string id);
        Task CreateUserAsync(CreateUserDto dto);
        Task UpdateUserStatusAsync(string id, bool isActive);
        Task ChangeUserRoleAsync(string id, string role);
        Task DeleteUserAsync(string id);
        Task<List<object>> GetCustomersAsync();
    }
}
