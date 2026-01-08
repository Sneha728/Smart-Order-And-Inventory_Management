using Microsoft.AspNetCore.Identity;
using Moq;

namespace SmartOrderInventory_tests.TestHelpers
{
    public static class IdentityMockFactory
    {
        public static UserManager<IdentityUser> CreateUserManager()
        {
            var store = new Mock<IUserStore<IdentityUser>>();
            return new UserManager<IdentityUser>(
                store.Object, null, null, null, null, null, null, null, null
            );
        }

        public static RoleManager<IdentityRole> CreateRoleManager()
        {
            var store = new Mock<IRoleStore<IdentityRole>>();
            return new RoleManager<IdentityRole>(
                store.Object, null, null, null, null
            );
        }
    }
}
