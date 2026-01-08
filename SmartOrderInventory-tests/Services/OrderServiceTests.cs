using Microsoft.AspNetCore.Identity;
using Moq;
using SmartOrderandInventoryApi.DTOs;
using SmartOrderandInventoryApi.Models;
using SmartOrderandInventoryApi.Repositories;
using SmartOrderandInventoryApi.Services;
using SmartOrderandInventoryApi.Services.Interfaces;
using SmartOrderInventory_tests.TestHelpers;
using Xunit;

public class OrderServiceTests
{
    [Fact]
    public async Task CreateOrder_Customer_CreatesOrder()
    {
        var db = TestDbContextFactory.Create();

        db.Products.Add(new Product { ProductId = 1, Price = 100 });
        db.Warehouses.Add(new Warehouse { WarehouseId = 1 });
        db.Inventories.Add(new Inventory { ProductId = 1, WarehouseId = 1, Quantity = 10 });
        db.SaveChanges();

        var invoiceMock = new Mock<IInvoiceService>();
        var userManager = IdentityMockFactory.CreateUserManager();

        var service = new OrderService(
            new OrderRepository(db),
            db,
            invoiceMock.Object,
            userManager,
            Mock.Of<IInventoryService>()
        );

        var id = await service.CreateOrderAsync(
            new OrderDto
            {
                WarehouseId = 1,
                OrderItems = new()
                {
                    new OrderItemDto { ProductId = 1, Quantity = 1 }
                }
            },
            "user1",
            "Customer"
        );

        Assert.True(id > 0);
    }
    [Fact]
    public async Task CreateOrder_InsufficientStock_Throws()
    {
        var db = TestDbContextFactory.Create();

        db.Products.Add(new Product { ProductId = 1, Price = 100 });
        db.Warehouses.Add(new Warehouse { WarehouseId = 1 });
        db.Inventories.Add(new Inventory { ProductId = 1, WarehouseId = 1, Quantity = 0 });
        db.SaveChanges();

        var service = new OrderService(
            new OrderRepository(db),
            db,
            Mock.Of<IInvoiceService>(),
            IdentityMockFactory.CreateUserManager(),
            Mock.Of<IInventoryService>()
        );

        await Assert.ThrowsAsync<Exception>(() =>
            service.CreateOrderAsync(
                new OrderDto
                {
                    WarehouseId = 1,
                    OrderItems = { new OrderItemDto { ProductId = 1, Quantity = 1 } }
                },
                "user1",
                "Customer"
            ));
    }
    [Fact]
    public async Task CancelOrder_CreatedOrder_ChangesStatus()
    {
        var db = TestDbContextFactory.Create();

        var order = new Order
        {
            OrderId = 1,
            CustomerId = "user1",
            Status = "Created"
        };

        db.Orders.Add(order);
        db.SaveChanges();

        var service = new OrderService(
            new OrderRepository(db),
            db,
            Mock.Of<IInvoiceService>(),
            IdentityMockFactory.CreateUserManager(),
            Mock.Of<IInventoryService>()
        );

        await service.CancelOrderAsync(1, "user1", "Customer");

        Assert.Equal("Cancelled", db.Orders.First().Status);
    }


}
