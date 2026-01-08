using SmartOrderandInventoryApi.Models;

namespace SmartOrderandInventoryApi.Repositories.Interfaces
{
    public interface IInvoiceRepository
    {
        Task<IEnumerable<Invoice>> GetAllAsync();
        Task<IEnumerable<Invoice>> GetByCustomerIdAsync(string customerId);
        Task<Invoice?> GetByIdAsync(int invoiceId);
        Task<Invoice?> GetByOrderIdAsync(int orderId);
        Task AddAsync(Invoice invoice);
        Task UpdateAsync(Invoice invoice);
        Task<IEnumerable<Invoice>> GetByUserAsync(string userId);
    }
}
