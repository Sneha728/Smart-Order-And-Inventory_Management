using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SmartOrderandInventoryApi.DTOs;
using SmartOrderandInventoryApi.Services.Interfaces;
using System.Security.Claims;

namespace SmartOrderandInventoryApi.Services
{
    public class AdminService : IAdminService
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AdminService(
            UserManager<IdentityUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<List<object>> GetAllUsersAsync()
        {
            var users = _userManager.Users.ToList();
            var result = new List<object>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var claims = await _userManager.GetClaimsAsync(user);

                foreach (var claim in claims)
                {
                    Console.WriteLine($"User: {user.Email}, ClaimType: {claim.Type}, Value: {claim.Value}");
                }



                if (roles.Contains("WarehouseManager"))
                {
                    result.Add(new
                    {
                        user.Id,
                        user.Email,
                        Roles = roles,
                        WarehouseId = claims
                            .FirstOrDefault(c => c.Type == "warehouseId")?.Value
                    });
                }
                else
                {
                    result.Add(new
                    {
                        user.Id,
                        user.Email,
                        Roles = roles
                    });
                }
            }

            return result;
        }


        public async Task<object> GetUserByIdAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id)
                       ?? throw new Exception("User not found");

            var roles = await _userManager.GetRolesAsync(user);
            var claims = await _userManager.GetClaimsAsync(user);

            return roles.Contains("WarehouseManager")
                ? new
                {
                    user.Id,
                    user.Email,
                    Roles = roles,
                    WarehouseId = claims
                        .FirstOrDefault(c => c.Type == "warehouseId")?.Value
                }
                : new
                {
                    user.Id,
                    user.Email,
                    Roles = roles
                };
        }


        public async Task CreateUserAsync(CreateUserDto dto)
        {
            var user = new IdentityUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new Exception(errors);
            }

            if (!await _roleManager.RoleExistsAsync(dto.Role))
                throw new Exception("Role does not exist");

            await _userManager.AddToRoleAsync(user, dto.Role);

            
            if (dto.Role == "WarehouseManager")
            {
                if (dto.WarehouseId == null)
                    throw new Exception("WarehouseId required");

                await _userManager.AddClaimAsync(
                    user,
                    new Claim("warehouseId", dto.WarehouseId.ToString())
                );
            }
        }

        public async Task UpdateUserStatusAsync(string id, bool isActive)
        {
            var user = await _userManager.FindByIdAsync(id)
                       ?? throw new Exception("User not found");

            //  Prevent Admin deactivation
            var roles = await _userManager.GetRolesAsync(user);
            if (roles.Contains("Admin"))
            {
                throw new Exception("Admin account cannot be deactivated");
            }

            user.LockoutEnabled = !isActive;
            user.LockoutEnd = isActive ? null : DateTimeOffset.MaxValue;

            await _userManager.UpdateAsync(user);
        }


        public async Task ChangeUserRoleAsync(string id, string role)
        {
            var user = await _userManager.FindByIdAsync(id)
                       ?? throw new Exception("User not found");

            //  Prevent changing Admin role
            var currentRoles = await _userManager.GetRolesAsync(user);
            if (currentRoles.Contains("Admin"))
            {
                throw new Exception("Admin role cannot be changed");
            }

            if (!await _roleManager.RoleExistsAsync(role))
                throw new Exception("Role does not exist");

            await _userManager.RemoveFromRolesAsync(user, currentRoles);
            await _userManager.AddToRoleAsync(user, role);
        }

        public async Task DeleteUserAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id)
                       ?? throw new Exception("User not found");

            //  prevent deleting Admin 
            var roles = await _userManager.GetRolesAsync(user);
            if (roles.Contains("Admin"))
                throw new Exception("Admin user cannot be deleted");

            // Remove claims 
            var claims = await _userManager.GetClaimsAsync(user);
            if (claims.Any())
                await _userManager.RemoveClaimsAsync(user, claims);

            // Remove roles
            if (roles.Any())
                await _userManager.RemoveFromRolesAsync(user, roles);

            // Delete user
            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new Exception(errors);
            }


        }
        public async Task<List<object>> GetCustomersAsync()
        {
            var users = _userManager.Users.ToList();
            var customers = new List<object>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                if (roles.Contains("Customer"))
                {
                    customers.Add(new
                    {
                        user.Email
                    });
                }
            }

            return customers;
        }


    }
}
