using Xunit;
using SmartOrderandInventoryApi.Services;
using SmartOrderInventory_tests.TestHelpers;

namespace SmartOrderInventory_tests.Services
{
    public class AdminServiceTests
    {
        [Fact]
        public async Task GetUserById_InvalidId_ThrowsException()
        {
            var service = new AdminService(
                IdentityMockFactory.CreateUserManager(),
                IdentityMockFactory.CreateRoleManager()
            );

            await Assert.ThrowsAsync<Exception>(() =>
                service.GetUserByIdAsync("invalid-id"));
        }

        [Fact]
        public async Task DeleteUser_InvalidId_ThrowsException()
        {
            var service = new AdminService(
                IdentityMockFactory.CreateUserManager(),
                IdentityMockFactory.CreateRoleManager()
            );

            await Assert.ThrowsAsync<Exception>(() =>
                service.DeleteUserAsync("invalid-id"));
        }
    }
}
