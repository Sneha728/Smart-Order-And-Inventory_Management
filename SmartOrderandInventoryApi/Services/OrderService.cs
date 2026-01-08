using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SmartOrderandInventoryApi.Data;
using SmartOrderandInventoryApi.DTOs;
using SmartOrderandInventoryApi.Models;
using SmartOrderandInventoryApi.Notifications;
using SmartOrderandInventoryApi.Repositories.Interfaces;
using SmartOrderandInventoryApi.Services.Interfaces;


namespace SmartOrderandInventoryApi.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _repo;
        private readonly ApplicationDbContext _context;
        private readonly IInvoiceService _invoiceService;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IInventoryService _inventoryService;



        public OrderService(
                IOrderRepository repo,
                ApplicationDbContext context,
                IInvoiceService invoiceService,
                UserManager<IdentityUser> userManager,
                IInventoryService inventoryService)
        {
            _repo = repo;
            _context = context;
            _invoiceService = invoiceService;
            _userManager = userManager;
            _inventoryService = inventoryService;
        }


        // CREATE ORDER 
        public async Task<int> CreateOrderAsync(
            OrderDto dto,
            string loggedInUserId,
            string role)
        {
            string customerId;

            if (role == "SalesExecutive")
            {
                if (string.IsNullOrWhiteSpace(dto.CustomerEmail))
                    throw new Exception("Customer email is required");

                var customer = await _userManager.FindByEmailAsync(dto.CustomerEmail);

                if (customer == null)
                    throw new Exception("Customer not found");

                var isCustomer = await _userManager.IsInRoleAsync(customer, "Customer");

                if (!isCustomer)
                    throw new Exception("Selected user is not a customer");

                customerId = customer.Id;
            }
            else
            {
                // Customer placing order for himself
                customerId = loggedInUserId;
            }

            var items = new List<OrderItem>();

            foreach (var i in dto.OrderItems)
            {
                var inventory = await _context.Inventories
                    .Include(x => x.Product)
                    .FirstOrDefaultAsync(x =>
                        x.ProductId == i.ProductId &&
                        x.WarehouseId == dto.WarehouseId);

                if (inventory == null || inventory.Quantity < i.Quantity)
                    throw new Exception("Insufficient stock");

                items.Add(new OrderItem
                {
                    ProductId = i.ProductId,
                    Quantity = i.Quantity,
                    UnitPrice = inventory.Product.Price
                });
            }

            var order = new Order
            {
                CustomerId = customerId,
                CreatedByUserId = loggedInUserId, 
                WarehouseId = dto.WarehouseId,
                OrderDate = DateTime.UtcNow,
                Status = "Created",
                OrderItems = items
            };

            await _repo.AddAsync(order);
            await _repo.SaveAsync();
            await _invoiceService.CreateInvoiceForOrderAsync(order);

            return order.OrderId;
        }




        // GET ORDERS
        public async Task<object> GetOrdersAsync(
            string role,
            string userId,
            int? warehouseId)
        {
            var query = await _repo.GetQueryableAsync();

            if (role == "Customer")
                query = query.Where(o => o.CustomerId == userId);

            else if (role == "SalesExecutive")
            {
                query = query.Where(o => o.CreatedByUserId == userId);
            }


            else if (role == "WarehouseManager")
            {
                if (warehouseId == null)
                    throw new Exception("Warehouse not assigned");

                query = query.Where(o => o.WarehouseId == warehouseId);
            }

            return await query.Select(o => new
            {
                o.OrderId,
                o.Status,
                o.WarehouseId,
                o.Warehouse.WarehouseName,
                OrderDate = ToIst(o.OrderDate),
                Items = o.OrderItems.Select(i => new
                {
                    i.Product.ProductName,
                    i.Quantity,
                    i.UnitPrice
                })
            }).ToListAsync();
        }

        // GET ORDER BY ID
        public async Task<object> GetOrderByIdAsync(
            int id,
            string role,
            string userId,
            int? warehouseId)
        {
            var order = await _repo.GetByIdAsync(id)
                ?? throw new Exception("Order not found");

            if (role == "Customer" && order.CustomerId != userId)
                throw new Exception("Unauthorized");

            if (role == "WarehouseManager" &&
                order.WarehouseId != warehouseId)
                throw new Exception("Unauthorized warehouse access");

            return new
            {
                order.OrderId,
                order.Status,
                order.WarehouseId,
                OrderDate = ToIst(order.OrderDate),
                Items = order.OrderItems.Select(i => new
                {
                    i.Product.ProductName,
                    i.Quantity,
                    i.UnitPrice
                })
            };
        }

        // UPDATE ORDER STATUS
        public async Task UpdateOrderStatusAsync(int id, string status, int warehouseId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(o => o.OrderId == id)
                ?? throw new Exception("Order not found");

            if (order.WarehouseId != warehouseId)
                throw new Exception("Unauthorized warehouse");

            var valid = order.Status switch
            {
                "Created" => status == "Approved",
                "Approved" => status == "Packed",
                "Packed" => status == "Shipped",
                "Shipped" => status == "Delivered",
                _ => false
            };

            if (!valid)
                throw new Exception($"Invalid transition from {order.Status}");

            if (status == "Shipped")
            {
                foreach (var item in order.OrderItems)
                {
                    var inventory = await _context.Inventories.FirstOrDefaultAsync(i =>
                        i.ProductId == item.ProductId &&
                        i.WarehouseId == order.WarehouseId);

                    if (inventory == null)
                        throw new Exception("Inventory record not found");

                    if (inventory.Quantity < item.Quantity)
                        throw new Exception("Insufficient stock");

                    inventory.Quantity -= item.Quantity;
                    inventory.LastUpdated = DateTime.UtcNow;

                    if (inventory.Quantity <= 5)
                    {
                        await NotificationQueue.Channel.Writer.WriteAsync(
                            new NotificationEvent
                            {
                                Title = "Low Stock Alert",
                                Message = $"Product {inventory.ProductId} is low in stock ({inventory.Quantity})",
                                UserRole = "WarehouseManager",
                                ReferenceId = inventory.ProductId.ToString()
                            });
                    }
                }

                await _context.SaveChangesAsync();
            }

            order.Status = status;

            await NotificationQueue.Channel.Writer.WriteAsync(
                new NotificationEvent
                {
                    Title = "Order Status Updated",
                    Message = $"Order #{order.OrderId} is now {status}",
                    UserRole = "Customer",
                    TargetUserId = order.CustomerId,
                    ReferenceId = order.OrderId.ToString()
                });

            if (!string.IsNullOrEmpty(order.CreatedByUserId))
            {
                await NotificationQueue.Channel.Writer.WriteAsync(
                    new NotificationEvent
                    {
                        Title = "Order Status Updated",
                        Message = $"Order #{order.OrderId} is now {status}",
                        UserRole = "SalesExecutive",
                        TargetUserId = order.CreatedByUserId,
                        ReferenceId = order.OrderId.ToString()
                    });
            }

            await _context.SaveChangesAsync();
        }




        // CANCEL ORDER
        public async Task CancelOrderAsync(int id, string userId, string role)
        {
            var order = await _repo.GetByIdAsync(id)
                ?? throw new Exception("Order not found");

            //  ROLE BASED AUTHORIZATION
            if (role == "Customer")
            {
                if (order.CustomerId != userId)
                    throw new Exception("Unauthorized");
            }
            else if (role == "SalesExecutive")
            {
                if (order.CreatedByUserId != userId)
                    throw new Exception("Unauthorized");
            }
           
            else
            {
                throw new Exception("Unauthorized");
            }

            
            if (order.Status == "Shipped" || order.Status == "Delivered")
                throw new Exception("Order cannot be cancelled after shipment");

            if (order.Status != "Created")
                throw new Exception("Only created orders can be cancelled");

            order.Status = "Cancelled";

            var invoice = await _context.Invoices .FirstOrDefaultAsync(i => i.OrderId == order.OrderId);

            if (invoice != null)
            {
                invoice.PaymentStatus = "Cancelled";
            }
            await _repo.SaveAsync();
        }



        private static string ToIst(DateTime utc) =>
            TimeZoneInfo.ConvertTimeFromUtc(
                utc,
                TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"))
            .ToString("dd-MMM-yyyy hh:mm tt 'IST'");
    }
}
