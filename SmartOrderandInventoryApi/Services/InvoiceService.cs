using SmartOrderandInventoryApi.DTOs;
using SmartOrderandInventoryApi.Models;
using SmartOrderandInventoryApi.Repositories.Interfaces;
using SmartOrderandInventoryApi.Services.Interfaces;

namespace SmartOrderandInventoryApi.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly IInvoiceRepository _invoiceRepo;

        public InvoiceService(IInvoiceRepository invoiceRepo)
        {
            _invoiceRepo = invoiceRepo;
        }

        // FINANCE → all invoices
        public async Task<IEnumerable<InvoiceDto>> GetAllInvoicesAsync()
        {
            var invoices = await _invoiceRepo.GetAllAsync();

            return invoices.Select(i => new InvoiceDto
            {
                InvoiceId = i.InvoiceId,
                OrderId = i.OrderId,
                TotalAmount = i.TotalAmount,
                PaymentStatus = i.PaymentStatus,
                InvoiceDate = i.GeneratedOn.ToString("dd-MMM-yyyy")
            });
        }

        // CUSTOMER → own invoices
        public async Task<IEnumerable<InvoiceDto>> GetMyInvoicesAsync(string userId)
        {
            var invoices = await _invoiceRepo.GetByUserAsync(userId);

            return invoices.Select(i => new InvoiceDto
            {
                InvoiceId = i.InvoiceId,
                OrderId = i.OrderId,
                TotalAmount = i.TotalAmount,
                PaymentStatus = i.PaymentStatus,
                InvoiceDate = i.GeneratedOn.ToString("dd-MMM-yyyy")
            });
        }



        // AUTO CREATE INVOICE ON ORDER CREATE
        public async Task CreateInvoiceForOrderAsync(Order order)
        {
           
            var existingInvoice = await _invoiceRepo.GetByOrderIdAsync(order.OrderId);
            if (existingInvoice != null)
                return;

            var total = order.OrderItems.Sum(i => i.Quantity * i.UnitPrice);

            var invoice = new Invoice
            {
                OrderId = order.OrderId,
                TotalAmount = total,
                PaymentStatus = "Pending",
                GeneratedOn = DateTime.UtcNow
            };

            await _invoiceRepo.AddAsync(invoice);
        }



    }
}
