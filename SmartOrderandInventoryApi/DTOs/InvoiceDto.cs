namespace SmartOrderandInventoryApi.DTOs
{
    public class InvoiceDto
    {
        public int InvoiceId { get; set; }
        public int OrderId { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;
        public string InvoiceDate { get; set; }= string.Empty;
    }
}   
