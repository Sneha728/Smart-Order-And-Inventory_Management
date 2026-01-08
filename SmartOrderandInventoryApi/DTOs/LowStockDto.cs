namespace SmartOrderandInventoryApi.DTOs
{
    public class LowStockDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
    }
}
