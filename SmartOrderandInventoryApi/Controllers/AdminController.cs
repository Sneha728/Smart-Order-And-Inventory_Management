using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SmartOrderandInventoryApi.DTOs;
using SmartOrderandInventoryApi.Services.Interfaces;

namespace SmartOrderandInventoryApi.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _adminService.GetAllUsersAsync();
            return Ok(users);
        }


        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _adminService.GetUserByIdAsync(id);
            return Ok(user);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("users")]
        public async Task<IActionResult> CreateUser(CreateUserDto dto)
        {
            await _adminService.CreateUserAsync(dto);
            return Ok("User created successfully");
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("users/{id}/status")]
        public async Task<IActionResult> UpdateStatus(string id, [FromQuery] bool isActive)
        {
            await _adminService.UpdateUserStatusAsync(id, isActive);
            return Ok("User status updated");
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("users/{id}/role")]
        public async Task<IActionResult> ChangeRole(string id, CreateUserDto dto)
        {
            await _adminService.ChangeUserRoleAsync(id, dto.Role);
            return Ok("Role updated");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            await _adminService.DeleteUserAsync(id);
            return Ok("User deleted successfully");
        }

       
        [Authorize(Roles = "SalesExecutive")]
        [HttpGet("customers")]
        public async Task<IActionResult> GetCustomers()
        {
            var customers = await _adminService.GetCustomersAsync();
            return Ok(customers);
        }



    }
}

    
