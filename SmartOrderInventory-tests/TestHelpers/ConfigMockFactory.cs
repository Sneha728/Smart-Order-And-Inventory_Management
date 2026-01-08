using Microsoft.Extensions.Configuration;

namespace SmartOrderInventory_tests.TestHelpers
{
    public static class ConfigMockFactory
    {
        public static IConfiguration Create()
        {
            var data = new Dictionary<string, string>
            {
                { "InventorySettings:LowStockThreshold", "5" }
            };

            return new ConfigurationBuilder()
                .AddInMemoryCollection(data!)
                .Build();
        }
    }
}
