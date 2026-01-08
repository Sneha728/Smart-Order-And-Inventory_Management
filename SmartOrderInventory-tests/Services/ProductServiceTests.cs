using Xunit;
using SmartOrderandInventoryApi.Services;
using SmartOrderandInventoryApi.Repositories;
using SmartOrderInventory_tests.TestHelpers;
using SmartOrderandInventoryApi.Models;
using SmartOrderandInventoryApi.DTOs;

public class ProductServiceTests
{
    [Fact]
    public async Task CreateProduct_AddsProductAndInventory()
    {
        var db = TestDbContextFactory.Create();
        db.Warehouses.Add(new Warehouse { WarehouseId = 1, WarehouseName = "WH" });
        db.Categories.Add(new Category { CategoryId = 1, CategoryName = "Cat" });
        db.SaveChanges();

        var service = new ProductService(new ProductRepository(db), db);

        await service.CreateProductAsync(new ProductDto
        {
            ProductName = "Phone",
            Price = 100,
            CategoryId = 1
        });

        Assert.Single(db.Products);
        Assert.Single(db.Inventories);
    }
    [Fact]
    public async Task GetAllProducts_EmptyDb_ReturnsEmpty()
    {
        var db = TestDbContextFactory.Create();
        var service = new ProductService(new ProductRepository(db), db);

        var result = await service.GetAllAsync();

        Assert.Empty(result);
    }

    [Fact]
    public async Task UpdateProduct_InvalidId_Throws()
    {
        var db = TestDbContextFactory.Create();
        var service = new ProductService(new ProductRepository(db), db);

        await Assert.ThrowsAsync<Exception>(() =>
            service.UpdateProductAsync(99, new ProductDto()));
    }


}
