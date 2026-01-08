using Microsoft.EntityFrameworkCore;
using SmartOrderandInventoryApi.Data;
using SmartOrderandInventoryApi.DTOs;
using SmartOrderandInventoryApi.Models;
using SmartOrderandInventoryApi.Repositories.Interfaces;
using SmartOrderandInventoryApi.Services.Interfaces;

namespace SmartOrderandInventoryApi.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repo;
        private readonly ApplicationDbContext _context;

        public ProductService(
            IProductRepository repo,
            ApplicationDbContext context)
        {
            _repo = repo;
            _context = context;
        }

        // VIEW ALL PRODUCTS
        public async Task<IEnumerable<object>> GetAllAsync()
        {
            var products = await _repo.GetAllAsync();

            return products.Select(p => new
            {
                p.ProductId,
                p.ProductName,
                p.Price,
                p.IsActive,
                CategoryId = p.CategoryId,                    
                Category = p.Category.CategoryName,
                CategoryIsActive = p.Category.IsActive,
                Stock = p.Inventories.Sum(i => i.Quantity)
            });
        }

        // VIEW PRODUCT BY ID
        public async Task<object?> GetProductAsync(int id)
        {
            var product = await _repo.GetByIdAsync(id);
            if (product == null) return null;

            return new
            {
                product.ProductId,
                product.ProductName,
                product.Price,
                product.IsActive,
                CategoryId = product.CategoryId,                  
                Category = product.Category.CategoryName,
                CategoryIsActive = product.Category.IsActive,
                Stock = product.Inventories.Sum(i => i.Quantity)
            };
        }

        // CREATE PRODUCT 
        public async Task CreateProductAsync(ProductDto dto)
        {
            var product = new Product
            {
                ProductName = dto.ProductName,
                Price = dto.Price,
                CategoryId = dto.CategoryId,
                IsActive = true
            };

            await _repo.AddAsync(product);
            await _repo.SaveAsync();

            // 🔹 Create inventory for ALL warehouses
            var warehouses = await _context.Warehouses.ToListAsync();

            foreach (var w in warehouses)
            {
                _context.Inventories.Add(new Inventory
                {
                    ProductId = product.ProductId,
                    WarehouseId = w.WarehouseId,
                    Quantity = 0,
                    LastUpdated = DateTime.UtcNow
                });
            }

            await _context.SaveChangesAsync();
        }

        // UPDATE PRODUCT
        public async Task UpdateProductAsync(int id, ProductDto dto)
        {
            var product = await _repo.GetByIdAsync(id)
                ?? throw new Exception("Product not found");

            product.ProductName = dto.ProductName;
            product.Price = dto.Price;
            product.CategoryId = dto.CategoryId;

            await _repo.SaveAsync();
        }

        public async Task UpdateProductStatusAsync(int id,ProductDto dto)
        {
            var product = await _repo.GetByIdAsync(id);
            if (product == null)
                throw new Exception("Product not found");

            product.IsActive = !product.IsActive;
            await _repo.SaveAsync();
        }


        // DELETE PRODUCT
        public async Task DeleteProductAsync(int id)
        {
            var product = await _repo.GetByIdAsync(id)
                ?? throw new Exception("Product not found");

            await _repo.DeleteAsync(product);
            await _repo.SaveAsync();
        }
    }
}
