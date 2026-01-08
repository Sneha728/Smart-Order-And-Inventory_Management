namespace SmartOrderandInventoryApi.Models
{
    public class Category
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
       

        public ICollection<Product> Products { get; set; }  = new List<Product>();

    }
}
