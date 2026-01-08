namespace SmartOrderandInventoryApi.DTOs
{
    public class OrderDto
    {
        public int WarehouseId { get; set; }
        public string? CustomerEmail { get; set; }
        public List<OrderItemDto> OrderItems { get; set; } = new List<OrderItemDto>();
    }
}
