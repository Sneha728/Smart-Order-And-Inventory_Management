using SmartOrderandInventoryApi.Data;
using SmartOrderandInventoryApi.Models;
using SmartOrderandInventoryApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SmartOrderandInventoryApi.Repositories
{
    public class InvoiceRepository : IInvoiceRepository
    {
        private readonly ApplicationDbContext _context;

        public InvoiceRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Invoice>> GetAllAsync()
        {
            return await _context.Invoices
                .Include(i => i.Order)
                .ToListAsync();
        }

        public async Task<IEnumerable<Invoice>> GetByCustomerIdAsync(string customerId)
        {
            return await _context.Invoices
                .Include(i => i.Order)
                .Where(i => i.Order.CustomerId == customerId)
                .ToListAsync();
        }

        public async Task<Invoice?> GetByIdAsync(int invoiceId)
        {
            return await _context.Invoices
                .FirstOrDefaultAsync(i => i.InvoiceId == invoiceId);
        }

        public async Task<Invoice?> GetByOrderIdAsync(int orderId)
        {
            return await _context.Invoices
                .FirstOrDefaultAsync(i => i.OrderId == orderId);
        }

        public async Task AddAsync(Invoice invoice)
        {
            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Invoice invoice)
        {
            _context.Invoices.Update(invoice);
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<Invoice>> GetByUserAsync(string userId)
        {
            return await _context.Invoices
                .Include(i => i.Order)
                .Where(i =>
                    i.Order.CustomerId == userId ||
                    i.Order.CreatedByUserId == userId
                )
                .ToListAsync();
        }

    }
}
