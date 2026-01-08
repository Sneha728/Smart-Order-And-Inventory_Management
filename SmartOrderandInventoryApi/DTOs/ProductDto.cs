namespace SmartOrderandInventoryApi.DTOs
{
    public class ProductDto
    {
        public string ProductName {  get; set; } = string.Empty;
        public decimal  Price { get; set; }
        public int CategoryId { get; set; }

    }
}
