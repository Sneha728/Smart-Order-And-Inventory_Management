using Xunit;
using SmartOrderandInventoryApi.Services;
using SmartOrderandInventoryApi.Repositories;
using SmartOrderandInventoryApi.Models;
using SmartOrderInventory_tests.TestHelpers;

namespace SmartOrderInventory_tests.Services
{
    public class ReportServiceTests
    {
        [Fact]
        public async Task GetDashboard_ForSalesExecutive_ReturnsSummary()
        {
            var db = TestDbContextFactory.Create();
            db.Orders.Add(new Order { Status = "Created" });
            await db.SaveChangesAsync();

            var repo = new ReportRepository(db);
            var service = new ReportService(repo);

            var result = await service.GetDashboardAsync("SalesExecutive", null);

            Assert.NotNull(result);
        }

        [Fact]
        public async Task GetTopProducts_ReturnsList()
        {
            var db = TestDbContextFactory.Create();

            var product = new Product { ProductName = "Item1" };
            db.Products.Add(product);

            db.OrderItems.Add(new OrderItem
            {
                Product = product,
                Quantity = 5,
                UnitPrice = 100
            });

            await db.SaveChangesAsync();

            var repo = new ReportRepository(db);
            var service = new ReportService(repo);

            var result = await service.GetTopProductsAsync();

            Assert.NotEmpty(result);
        }


        [Fact]
       
        public async Task GetInventoryStatus_ReturnsWarehouseInventory()
        {
            var db = TestDbContextFactory.Create();

            var product = new Product { ProductName = "Item1" };
            db.Products.Add(product);

            db.Inventories.Add(new Inventory
            {
                Product = product,
                WarehouseId = 1,
                Quantity = 10
            });

            await db.SaveChangesAsync();

            var repo = new ReportRepository(db);
            var service = new ReportService(repo);

            var result = await service.GetInventoryStatusAsync(1);

            Assert.Single(result);
        }

    }
}
