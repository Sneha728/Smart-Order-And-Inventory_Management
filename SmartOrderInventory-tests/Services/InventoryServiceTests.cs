using Xunit;
using SmartOrderandInventoryApi.Services;
using SmartOrderandInventoryApi.Repositories;
using SmartOrderInventory_tests.TestHelpers;
using SmartOrderandInventoryApi.Models;
using SmartOrderandInventoryApi.DTOs;

public class InventoryServiceTests
{
    [Fact]
    public async Task GetAllInventory_Admin_ReturnsAll()
    {
        var db = TestDbContextFactory.Create();
        var repo = new InventoryRepository(db);
        var config = ConfigMockFactory.Create();

        db.Products.Add(new Product { ProductId = 1, ProductName = "Item" });
        db.Inventories.Add(new Inventory { ProductId = 1, WarehouseId = 1, Quantity = 10 });
        db.SaveChanges();

        var service = new InventoryService(repo, config, db);
        var result = await service.GetAllAsync(null, "Admin");

        Assert.Single(result);
    }

    [Fact]
    public async Task UpdateStock_InvalidProduct_Throws()
    {
        var db = TestDbContextFactory.Create();
        var service = new InventoryService(
            new InventoryRepository(db),
            ConfigMockFactory.Create(),
            db
        );

        await Assert.ThrowsAsync<Exception>(() =>
            service.UpdateStockAsync(new InventoryDto { ProductId = 1, Quantity = 5 }, 1));
    }
    [Fact]
    public async Task GetAllInventory_WarehouseManager_FiltersWarehouse()
    {
        var db = TestDbContextFactory.Create();
        var repo = new InventoryRepository(db);

        db.Products.Add(new Product { ProductId = 1 });
        db.Inventories.AddRange(
            new Inventory { ProductId = 1, WarehouseId = 1, Quantity = 5 },
            new Inventory { ProductId = 1, WarehouseId = 2, Quantity = 10 }
        );
        db.SaveChanges();

        var service = new InventoryService(repo, ConfigMockFactory.Create(), db);

        var result = await service.GetAllAsync(1, "WarehouseManager");

        Assert.Single(result);
    }
    [Fact]
    public async Task UpdateStock_NewInventory_CreatesInventory()
    {
        var db = TestDbContextFactory.Create();

        db.Products.Add(new Product { ProductId = 1 });
        db.Warehouses.Add(new Warehouse { WarehouseId = 1 });
        db.SaveChanges();

        var service = new InventoryService(
            new InventoryRepository(db),
            ConfigMockFactory.Create(),
            db
        );

        await service.UpdateStockAsync(
            new InventoryDto { ProductId = 1, Quantity = 5 },
            1
        );

        Assert.Single(db.Inventories);
    }


}
