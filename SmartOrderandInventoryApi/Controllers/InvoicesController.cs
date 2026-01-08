using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartOrderandInventoryApi.Services.Interfaces;
using System.Security.Claims;

namespace SmartOrderandInventoryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoicesController : ControllerBase
    {
        private readonly IInvoiceService _service;

        public InvoicesController(IInvoiceService service)
        {
            _service = service;
        }

        // FINANCE → all invoices
        [Authorize(Roles = "FinanceOfficer")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllInvoicesAsync());
        }

        // CUSTOMER → own invoices
        [Authorize(Roles = "Customer,SalesExecutive")]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyInvoices()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Ok(await _service.GetMyInvoicesAsync(userId));
        }
    }
}
