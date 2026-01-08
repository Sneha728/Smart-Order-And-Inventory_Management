using Xunit;
using SmartOrderandInventoryApi.Services;
using SmartOrderandInventoryApi.DTOs;
using SmartOrderandInventoryApi.Models;
using SmartOrderInventory_tests.TestHelpers;

namespace SmartOrderInventory_tests.Services
{
    public class WarehouseServiceTests
    {
        [Fact]
        public async Task GetAllWarehouses_ReturnsList()
        {
            var db = TestDbContextFactory.Create();
            db.Warehouses.Add(new Warehouse { WarehouseName = "WH1", Location = "Loc" });
            await db.SaveChangesAsync();

            var service = new WarehouseService(db);

            var result = await service.GetAllAsync();

            Assert.Single(result);
        }

        [Fact]
        public async Task CreateWarehouse_ShouldCreateWarehouseAndInventory()
        {
            var db = TestDbContextFactory.Create();
            db.Products.Add(new Product { ProductName = "P1", Price = 10 });
            await db.SaveChangesAsync();

            var service = new WarehouseService(db);

            await service.CreateAsync(new WarehouseDto
            {
                WarehouseName = "WH2",
                Location = "City"
            });

            Assert.Single(db.Warehouses);
            Assert.Single(db.Inventories);
        }

        [Fact]
        public async Task GetProductsByWarehouse_ReturnsStock()
        {
            var db = TestDbContextFactory.Create();
            var product = new Product { ProductName = "P1", Price = 10 };
            db.Products.Add(product);
            db.Inventories.Add(new Inventory
            {
                Product = product,
                WarehouseId = 1,
                Quantity = 5
            });
            await db.SaveChangesAsync();

            var service = new WarehouseService(db);

            var result = await service.GetProductsByWarehouseAsync(1);

            Assert.Single(result);
        }
    }
}
