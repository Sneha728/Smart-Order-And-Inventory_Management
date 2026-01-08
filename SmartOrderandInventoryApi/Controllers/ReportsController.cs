using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartOrderandInventoryApi.Services.Interfaces;
using System.Security.Claims;

namespace SmartOrderandInventoryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "SalesExecutive,WarehouseManager,FinanceOfficer")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _service;

        public ReportsController(IReportService service)
        {
            _service = service;
        }

        // DASHBOARD
        [HttpGet("dashboard")]
        public async Task<IActionResult> Dashboard()
        {
            var role = User.FindFirstValue(ClaimTypes.Role);
            int? warehouseId = null;

            if (role == "WarehouseManager")
                warehouseId = int.Parse(User.FindFirst("warehouseId")!.Value);

            return Ok(await _service.GetDashboardAsync(role, warehouseId));
        }

        // SALES EXEC → TOP PRODUCTS
        [Authorize(Roles = "SalesExecutive,FinanceOfficer")]
        [HttpGet("top-products")]
        public async Task<IActionResult> TopProducts()
        {
            return Ok(await _service.GetTopProductsAsync());
        }

        // WAREHOUSE → INVENTORY STATUS
        [Authorize(Roles = "WarehouseManager")]
        [HttpGet("inventory-status")]
        public async Task<IActionResult> InventoryStatus()
        {
            var warehouseId = int.Parse(User.FindFirst("warehouseId")!.Value);
            return Ok(await _service.GetInventoryStatusAsync(warehouseId));
        }
    }

}

