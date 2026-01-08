namespace SmartOrderandInventoryApi.DTOs
{
    public class DashboardSummaryDto
    {
        public int TotalOrders { get; set; }
        public int CreatedOrders { get; set; }
        public int ShippedOrders { get; set; }
        public int DeliveredOrders { get; set; }

        public decimal TotalSales { get; set; }

        public int LowStockCount { get; set; }
    }
}
