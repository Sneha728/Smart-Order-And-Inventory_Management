using Microsoft.EntityFrameworkCore;
using SmartOrderandInventoryApi.Data;
using SmartOrderandInventoryApi.Models;
using SmartOrderandInventoryApi.Repositories.Interfaces;

namespace SmartOrderandInventoryApi.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly ApplicationDbContext _context;

        public PaymentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Payment payment)
        {
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Payment>> GetByInvoiceIdAsync(int invoiceId)
        {
            return await _context.Payments
                .Where(p => p.InvoiceId == invoiceId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Payment>> GetAllAsync()
        {
            return await _context.Payments
                .Include(p => p.Invoice)
                .ThenInclude(i => i.Order)
                .ToListAsync();
        }
    }
}
