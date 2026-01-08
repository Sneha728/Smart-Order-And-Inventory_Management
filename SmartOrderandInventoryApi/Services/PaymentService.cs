using SmartOrderandInventoryApi.DTOs;
using SmartOrderandInventoryApi.Models;
using SmartOrderandInventoryApi.Repositories.Interfaces;
using SmartOrderandInventoryApi.Services.Interfaces;

namespace SmartOrderandInventoryApi.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _paymentRepo;
        private readonly IInvoiceRepository _invoiceRepo;

        public PaymentService(
            IPaymentRepository paymentRepo,
            IInvoiceRepository invoiceRepo)
        {
            _paymentRepo = paymentRepo;
            _invoiceRepo = invoiceRepo;
        }

        // CUSTOMER pays invoice
        public async Task RecordPaymentAsync(PaymentDto dto)
        {
            var invoice = await _invoiceRepo.GetByIdAsync(dto.InvoiceId)
                          ?? throw new Exception("Invoice not found");

            if (invoice.PaymentStatus == "Paid")
                throw new Exception("Invoice already paid");

            if (dto.Amount != invoice.TotalAmount)
                throw new Exception("Payment amount mismatch");

            var payment = new Payment
            {
                InvoiceId = dto.InvoiceId,
                Amount = dto.Amount,
                PaymentMethod = dto.PaymentMethod,
                PaidOn = DateTime.UtcNow
            };

            await _paymentRepo.AddAsync(payment);

            invoice.PaymentStatus = "Paid";
            await _invoiceRepo.UpdateAsync(invoice);
        }

        // FINANCE → view all payments
        public async Task<IEnumerable<object>> GetAllPaymentsAsync()
        {
            var payments = await _paymentRepo.GetAllAsync();

            return payments.Select(p => new
            {
                p.PaymentId,
                p.InvoiceId,
                p.Amount,
                p.PaymentMethod,
                PaidOn = p.PaidOn.ToString("dd-MMM-yyyy"),
                OrderId = p.Invoice.OrderId
            });
        }
    }
}
