using SmartOrderandInventoryApi.DTOs;
using System.Security.Claims;

namespace SmartOrderandInventoryApi.Services.Interfaces
{
    public interface IOrderService
    {
        Task<int> CreateOrderAsync(OrderDto dto, string loggedInUserId,string role);
        Task<object> GetOrdersAsync(string role, string userId, int? warehouseId);
        Task<object> GetOrderByIdAsync(int orderId, string role, string userId, int? warehouseId);
        
        Task UpdateOrderStatusAsync(int id, string status, int warehouseId);
        Task CancelOrderAsync(int id, string userId, string role);



    }
}
