namespace SmartOrderandInventoryApi.Models
{
    public class Warehouse
    {
        public int WarehouseId {  get; set; }
        public string WarehouseName { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public ICollection<Inventory> Inventories { get; set; } = new List<Inventory>();
    }
}
