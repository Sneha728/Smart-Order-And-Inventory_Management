namespace SmartOrderandInventoryApi.DTOs
{
    public class PaymentDto
    {
        public int InvoiceId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
    }
}
