using Microsoft.EntityFrameworkCore;

namespace SmartOrderandInventoryApi.Models
{
    public class Invoice
    {
        public int InvoiceId { get; set; }

        
        public decimal TotalAmount { get; set; }
        public DateTime GeneratedOn { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;

        public int OrderId { get; set; }

        
        public Order Order { get; set; }
    }
}
