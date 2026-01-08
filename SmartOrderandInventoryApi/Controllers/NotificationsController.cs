using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartOrderandInventoryApi.Data;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace SmartOrderandInventoryApi.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NotificationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role);

            var notifications = await _context.Notifications
                .Where(n =>
                    n.UserRole == role &&
                    (n.TargetUserId == null || n.TargetUserId == userId)
                )
                .OrderByDescending(n => n.CreatedOn)
                .ToListAsync();

            return Ok(notifications);
        }

        // MARK AS READ
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null) return NotFound();

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

}
