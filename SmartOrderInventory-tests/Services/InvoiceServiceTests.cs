using Xunit;
using SmartOrderandInventoryApi.Services;
using SmartOrderandInventoryApi.Repositories;
using SmartOrderandInventoryApi.Models;
using SmartOrderInventory_tests.TestHelpers;

namespace SmartOrderInventory_tests.Services
{
    public class InvoiceServiceTests
    {
        [Fact]
       
        public async Task GetAllInvoices_ShouldReturnInvoices()
        {
            var db = TestDbContextFactory.Create();

            var order = new Order { OrderId = 1 };
            db.Orders.Add(order);

            db.Invoices.Add(new Invoice
            {
                OrderId = 1,
                TotalAmount = 100,
                PaymentStatus = "Pending",
                GeneratedOn = DateTime.UtcNow
            });

            await db.SaveChangesAsync();

            var repo = new InvoiceRepository(db);
            var service = new InvoiceService(repo);

            var result = await service.GetAllInvoicesAsync();

            Assert.Single(result);
        }


        [Fact]
        public async Task GetMyInvoices_ShouldReturnUserInvoices()
        {
            var db = TestDbContextFactory.Create();
            db.Orders.Add(new Order { OrderId = 1, CustomerId = "user1" });
            db.Invoices.Add(new Invoice
            {
                OrderId = 1,
                TotalAmount = 200,
                PaymentStatus = "Pending",
                GeneratedOn = DateTime.UtcNow
            });
            await db.SaveChangesAsync();

            var repo = new InvoiceRepository(db);
            var service = new InvoiceService(repo);

            var result = await service.GetMyInvoicesAsync("user1");

            Assert.Single(result);
        }

        [Fact]
        public async Task CreateInvoiceForOrder_ShouldCreateInvoice()
        {
            var db = TestDbContextFactory.Create();
            var order = new Order
            {
                OrderId = 1,
                OrderItems = new List<OrderItem>
                {
                    new OrderItem { Quantity = 2, UnitPrice = 50 }
                }
            };

            var repo = new InvoiceRepository(db);
            var service = new InvoiceService(repo);

            await service.CreateInvoiceForOrderAsync(order);

            Assert.Single(db.Invoices);
        }
    }
}
