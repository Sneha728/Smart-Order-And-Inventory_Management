namespace SmartOrderandInventoryApi.DTOs
{
    public class InventoryResponseDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public string LastUpdated { get; set; }
    }
}
