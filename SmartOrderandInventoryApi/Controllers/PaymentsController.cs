using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartOrderandInventoryApi.DTOs;
using SmartOrderandInventoryApi.Services.Interfaces;

namespace SmartOrderandInventoryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _service;

        public PaymentsController(IPaymentService service)
        {
            _service = service;
        }

        // CUSTOMER → pay invoice
        [Authorize(Roles = "Customer,SalesExecutive")]
        [HttpPost("pay")]
        public async Task<IActionResult> Pay(PaymentDto dto)
        {
            await _service.RecordPaymentAsync(dto);
            return Ok("Payment successful");
        }

        // FINANCE → view all payments
        [Authorize(Roles = "FinanceOfficer")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllPaymentsAsync());
        }
    }
}
