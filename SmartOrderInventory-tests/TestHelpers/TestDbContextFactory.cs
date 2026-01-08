using Microsoft.EntityFrameworkCore;
using SmartOrderandInventoryApi.Data;

namespace SmartOrderInventory_tests.TestHelpers
{
    public static class TestDbContextFactory
    {
        public static ApplicationDbContext Create()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new ApplicationDbContext(options);
        }
    }
}
