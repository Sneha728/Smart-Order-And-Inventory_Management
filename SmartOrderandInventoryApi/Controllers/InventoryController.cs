using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartOrderandInventoryApi.DTOs;
using SmartOrderandInventoryApi.Services.Interfaces;
using System.Security.Claims;

namespace SmartOrderandInventoryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _service;

        public InventoryController(IInventoryService service)
        {
            _service = service;
        }

        // GET ALL INVENTORIES
        [Authorize(Roles = "WarehouseManager")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var role = User.FindFirstValue(ClaimTypes.Role);

            int? warehouseId = null;

            if (role == "WarehouseManager")
            {
                var warehouseClaim = User.FindFirst("warehouseId")?.Value;

                if (warehouseClaim == null)
                    return BadRequest("Warehouse not assigned");

                warehouseId = int.Parse(warehouseClaim);
            }

            var result = await _service.GetAllAsync(warehouseId, role);
            return Ok(result);
        }

        // UPDATE STOCK
        [Authorize(Roles = "WarehouseManager")]
        [HttpPut]
        public async Task<IActionResult> UpdateStock(InventoryDto dto)
        {
            var warehouseClaim = User.FindFirst("warehouseId")?.Value;

            if (warehouseClaim == null)
                return BadRequest("Warehouse not assigned");

            int warehouseId = int.Parse(warehouseClaim);

            await _service.UpdateStockAsync(dto, warehouseId);
            return Ok("Inventory updated successfully");
        }

        // LOW STOCK
        [Authorize(Roles = "WarehouseManager")]
        [HttpGet("low-stock")]
        public async Task<IActionResult> GetLowStock()
        {
            var role = User.FindFirstValue(ClaimTypes.Role);

            int? warehouseId = null;

            if (role == "WarehouseManager")
            {
                var warehouseClaim = User.FindFirst("warehouseId")?.Value;

                if (warehouseClaim == null)
                    return BadRequest("Warehouse not assigned");

                warehouseId = int.Parse(warehouseClaim);
            }

            var result = await _service.GetLowStockAsync(warehouseId, role);
            return Ok(result);
        }
    }
}
