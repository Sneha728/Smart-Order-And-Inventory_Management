using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartOrderandInventoryApi.DTOs;
using SmartOrderandInventoryApi.Services;
using SmartOrderandInventoryApi.Services.Interfaces;
using System.Security.Claims;

namespace SmartOrderandInventoryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _service;

        public OrdersController(IOrderService service)
        {
            _service = service;
        }

        // CREATE ORDER
        
        [Authorize(Roles = "Customer,SalesExecutive")]
        [HttpPost]
        public async Task<IActionResult> CreateOrder(OrderDto dto)
        {
            var role = User.FindFirstValue(ClaimTypes.Role);
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var orderId = await _service.CreateOrderAsync(dto, userId, role);

            return Ok(new { orderId });
        }


        // GET ORDERS
        [Authorize(Roles = "Customer,SalesExecutive,WarehouseManager")]
        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var role = User.FindFirstValue(ClaimTypes.Role);
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            int? warehouseId = null;
            if (role == "WarehouseManager")
            {
                warehouseId = int.Parse(
                    User.FindFirst("warehouseId")?.Value
                    ?? throw new Exception("Warehouse not assigned"));
            }

            return Ok(await _service.GetOrdersAsync(role, userId, warehouseId));
        }

        // GET ORDER BY ID
        [Authorize(Roles = "Customer,SalesExecutive,WarehouseManager")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var role = User.FindFirstValue(ClaimTypes.Role);
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            int? warehouseId = null;
            if (role == "WarehouseManager")
            {
                warehouseId = int.Parse(
                    User.FindFirst("warehouseId")?.Value
                    ?? throw new Exception("Warehouse not assigned"));
            }

            return Ok(await _service.GetOrderByIdAsync(id, role, userId, warehouseId));
        }

        // UPDATE STATUS
        [Authorize(Roles = "WarehouseManager")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, UpdateOrderStatusDto dto)
        {
            var warehouseId = int.Parse(
                User.FindFirst("warehouseId")?.Value
                ?? throw new Exception("Warehouse not assigned"));

            await _service.UpdateOrderStatusAsync(id, dto.Status, warehouseId);
            return Ok($"Order status updated to {dto.Status}");
        }

        // CANCEL ORDER
        [Authorize(Roles = "Customer,SalesExecutive")]
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> Cancel(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role);
            await _service.CancelOrderAsync(id, userId,role);
            return Ok("Order cancelled");
        }



    }
}
