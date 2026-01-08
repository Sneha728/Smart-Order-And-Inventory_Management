using Xunit;
using SmartOrderandInventoryApi.Services;
using SmartOrderandInventoryApi.Repositories;
using SmartOrderInventory_tests.TestHelpers;
using SmartOrderandInventoryApi.Models;
using SmartOrderandInventoryApi.DTOs;

public class PaymentServiceTests
{
    [Fact]
    public async Task RecordPayment_ValidPayment_MarksPaid()
    {
        var db = TestDbContextFactory.Create();

        db.Invoices.Add(new Invoice
        {
            InvoiceId = 1,
            TotalAmount = 500,
            PaymentStatus = "Pending"
        });
        db.SaveChanges();

        var service = new PaymentService(
            new PaymentRepository(db),
            new InvoiceRepository(db)
        );

        await service.RecordPaymentAsync(new PaymentDto
        {
            InvoiceId = 1,
            Amount = 500,
            PaymentMethod = "UPI"
        });

        Assert.Equal("Paid", db.Invoices.First().PaymentStatus);
    }
}
