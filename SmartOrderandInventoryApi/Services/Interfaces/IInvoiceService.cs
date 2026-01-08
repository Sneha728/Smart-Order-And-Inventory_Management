using SmartOrderandInventoryApi.DTOs;
using SmartOrderandInventoryApi.Models;

namespace SmartOrderandInventoryApi.Services.Interfaces
{
    public interface IInvoiceService
    {
        Task<IEnumerable<InvoiceDto>> GetAllInvoicesAsync();
        Task<IEnumerable<InvoiceDto>> GetMyInvoicesAsync(string customerId);
        Task CreateInvoiceForOrderAsync(Order order);
    }
}
