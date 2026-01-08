using SmartOrderandInventoryApi.DTOs;

namespace SmartOrderandInventoryApi.Services.Interfaces
{
    public interface IPaymentService
    {
        Task RecordPaymentAsync(PaymentDto dto);
        Task<IEnumerable<object>> GetAllPaymentsAsync();
    }
}
