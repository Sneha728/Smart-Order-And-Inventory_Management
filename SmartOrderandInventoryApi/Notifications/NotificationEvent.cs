namespace SmartOrderandInventoryApi.Notifications
{
    public class NotificationEvent
    {
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? UserRole { get; set; }
        public string? ReferenceId { get; set; }
        public string? TargetUserId { get; set; }
    }
}
