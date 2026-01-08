using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartOrderandInventoryApi.Models
{
    public class Product
    {
        public int ProductId {  get; set; }

        public string ProductName {  get; set; } = string.Empty;

        
        public decimal Price { get; set; }
        public bool IsActive { get; set; } = true;
        public int CategoryId { get; set; }

        public Category Category { get; set; }  
        
        public ICollection<Inventory> Inventories { get; set; } = new List<Inventory>();
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    }
}
