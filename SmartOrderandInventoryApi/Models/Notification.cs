namespace SmartOrderandInventoryApi.Models
{
    public class Notification
    {
        public int NotificationId { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty; // OrderStatus | LowStock
        public string? UserRole { get; set; } // Customer | WarehouseManager
        public bool IsRead { get; set; } = false;
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
        public string? TargetUserId { get; set; }
    }
}
