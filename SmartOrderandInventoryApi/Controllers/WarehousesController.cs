using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartOrderandInventoryApi.DTOs;
using SmartOrderandInventoryApi.Services.Interfaces;

namespace SmartOrderandInventoryApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
   
    public class WarehousesController : ControllerBase
    {
        private readonly IWarehouseService _service;

        public WarehousesController(IWarehouseService service)
        {
            _service = service;
        }

        // GET all warehouses
        [Authorize(Roles ="Admin,Customer,SalesExecutive")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        // CREATE warehouse
        [HttpPost]
        public async Task<IActionResult> Create(WarehouseDto dto)
        {
            await _service.CreateAsync(dto);
            return Ok("Warehouse created successfully");
        }
        [Authorize(Roles = "WarehouseManager")]
        [HttpGet("orders")]

        public async Task<IActionResult> GetWarehouseOrders()
        {
            var orders = await _service.GetWarehouseOrdersAsync();
            return Ok(orders);
        }

        [Authorize(Roles = "Customer,SalesExecutive")]
        [HttpGet("{warehouseId}/products")]
        public async Task<IActionResult> GetProductsByWarehouse(int warehouseId)
        {
            var products = await _service.GetProductsByWarehouseAsync(warehouseId);
            return Ok(products);
        }
        [Authorize(Roles = "WarehouseManager")]
        [HttpGet("{warehouseId}/orders")]
        public async Task<IActionResult> GetOrdersByWarehouse(int warehouseId)
        {
            var orders = await _service.GetOrdersByWarehouseAsync(warehouseId);
            return Ok(orders);
        }


    }
}
   
