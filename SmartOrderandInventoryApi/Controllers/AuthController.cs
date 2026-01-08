using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SmartOrderandInventoryApi.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SmartOrderandInventoryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IConfiguration _config;

        public AuthController(
            UserManager<IdentityUser> userManager,
            IConfiguration config)
        {
            _userManager = userManager;
            _config = config;
        }

        // CUSTOMER REGISTER
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterAndLoginDto dto)
        {
            var existingUser =
                await _userManager.FindByEmailAsync(dto.Email);

            if (existingUser != null)
                return BadRequest("User already exists");

            var user = new IdentityUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                EmailConfirmed = true
            };

            var result =
                await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, "Customer");

            return Ok(new { message = "User registered successfully" });
        }

        // LOGIN (ALL ROLES)
        [HttpPost("login")]
        public async Task<IActionResult> Login(RegisterAndLoginDto dto)
        {
            var user =
                await _userManager.FindByEmailAsync(dto.Email);

            if (user == null ||
                !await _userManager.CheckPasswordAsync(user, dto.Password))
                return Unauthorized("Invalid credentials");

            if (await _userManager.IsLockedOutAsync(user))
                return Unauthorized("User account is deactivated");

            var roles =
                await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            
            if (roles.Contains("WarehouseManager"))
            {
                // warehouseId must be provided by Admin during user creation
                // stored temporarily in AspNetUserClaims
                var warehouseClaim =
                    (await _userManager.GetClaimsAsync(user))
                    .FirstOrDefault(c => c.Type == "warehouseId");

                if (warehouseClaim != null)
                {
                    claims.Add(new Claim("warehouseId", warehouseClaim.Value));
                }
            }

            var jwt = _config.GetSection("Jwt");

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwt["Key"]));

            var token = new JwtSecurityToken(
                issuer: jwt["Issuer"],
                audience: jwt["Audience"],
                expires: DateTime.UtcNow.AddHours(2),
                claims: claims,
                signingCredentials:
                    new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token)
            });
        }
    }
}
