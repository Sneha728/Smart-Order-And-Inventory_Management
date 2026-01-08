namespace SmartOrderandInventoryApi.Models
{
    public class Order
    {
        public int OrderId { get; set; } 
        public string Status { get; set; }    = string.Empty;
        public DateTime OrderDate { get; set; }
        public string? CreatedByUserId { get; set; }

        public int WarehouseId { get; set; }
        public Warehouse Warehouse { get; set; }

        public string CustomerId { get; set; } = string.Empty;
      
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public Invoice Invoice { get; set; }
    }
}
