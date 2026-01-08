using Microsoft.AspNetCore.Identity;
using SmartOrderandInventoryApi.Models;

namespace SmartOrderandInventoryApi.Data
{
    public class DataSeeder
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ApplicationDbContext _context;

        public DataSeeder(
            IServiceProvider serviceProvider,
            ApplicationDbContext context)
        {
            _serviceProvider = serviceProvider;
            _context = context;
        }

        public async Task CreateRolesAsync()
        {

            await _context.Database.EnsureCreatedAsync();

            var userManager =
                _serviceProvider.GetRequiredService<UserManager<IdentityUser>>();

            var roleManager =
                _serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            //  ROLES 
            string[] roles =
            {
                "Admin",
                "SalesExecutive",
                "WarehouseManager",
                "FinanceOfficer",
                "Customer"
            };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }

            // ADMIN USER 
            var adminEmail = "admin@system.com";

            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                adminUser = new IdentityUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    EmailConfirmed = true
                };

                var result =
                    await userManager.CreateAsync(adminUser, "Admin@123");

                if (result.Succeeded)
                    await userManager.AddToRoleAsync(adminUser, "Admin");
            }


            // =======================
            // EXTRA USERS
            // =======================

            // Get a warehouse for WarehouseManager claim
            var firstWarehouse = _context.Warehouses.FirstOrDefault();

            // WAREHOUSE MANAGER
            await CreateUserIfNotExistsAsync(
                userManager,
                roleManager,
                email: "wm1@system.com",
                password: "WM1@123",
                role: "WarehouseManager",
                warehouseId: firstWarehouse?.WarehouseId
            );

            // CUSTOMER
            await CreateUserIfNotExistsAsync(
                userManager,
                roleManager,
                email: "murari@gmail.com",
                password: "Murari@123",
                role: "Customer"
            );

            // SALES EXECUTIVE
            await CreateUserIfNotExistsAsync(
                userManager,
                roleManager,
                email: "sales1@system.com",
                password: "Sales@123",
                role: "SalesExecutive"
            );

            // FINANCE OFFICER
            await CreateUserIfNotExistsAsync(
                userManager,
                roleManager,
                email: "sandy@finance.com",
                password: "Sandy@123",
                role: "FinanceOfficer"
            );





            // CATEGORIES
            if (!_context.Categories.Any())
            {
                _context.Categories.AddRange(
                    new Category { CategoryName = "Electronics" },
                    new Category { CategoryName = "Groceries" },
                    new Category { CategoryName = "Fashion" },
                    new Category { CategoryName = "Home Appliances" },
                    new Category { CategoryName = "Books" },
                    new Category { CategoryName = "Sports" }
                );

                await _context.SaveChangesAsync();
            }

            // WAREHOUSES 
            if (!_context.Warehouses.Any())
            {
                _context.Warehouses.AddRange(
                    new Warehouse
                    {
                        WarehouseName = "Central Warehouse",
                        Location = "Hyderabad"
                    },
                    new Warehouse
                    {
                        WarehouseName = "South Distribution Hub",
                        Location = "Bangalore"
                    },
                    new Warehouse
                    {
                        WarehouseName = "East Storage Unit",
                        Location = "Chennai"
                    }
                );

                await _context.SaveChangesAsync();
            }

            // PRODUCTS
            if (!_context.Products.Any())
            {
                var categories = _context.Categories.ToList();

                var electronics = categories.First(c => c.CategoryName == "Electronics");
                var groceries = categories.First(c => c.CategoryName == "Groceries");
                var fashion = categories.First(c => c.CategoryName == "Fashion");
                var home = categories.First(c => c.CategoryName == "Home Appliances");
                var books = categories.First(c => c.CategoryName == "Books");
                var sports = categories.First(c => c.CategoryName == "Sports");

                _context.Products.AddRange(

                    // Electronics
                    new Product { ProductName = "Laptop", Price = 55000, CategoryId = electronics.CategoryId },
                    new Product { ProductName = "Smartphone", Price = 25000, CategoryId = electronics.CategoryId },
                    new Product { ProductName = "Bluetooth Speaker", Price = 3000, CategoryId = electronics.CategoryId },
                    new Product { ProductName = "Headphones", Price = 2000, CategoryId = electronics.CategoryId },

                    // Groceries
                    new Product { ProductName = "Rice Bag", Price = 1200, CategoryId = groceries.CategoryId },
                    new Product { ProductName = "Wheat Flour", Price = 450, CategoryId = groceries.CategoryId },
                    new Product { ProductName = "Cooking Oil", Price = 180, CategoryId = groceries.CategoryId },
                    new Product { ProductName = "Sugar", Price = 50, CategoryId = groceries.CategoryId },

                    // Fashion
                    new Product { ProductName = "Men T-Shirt", Price = 700, CategoryId = fashion.CategoryId },
                    new Product { ProductName = "Women Dress", Price = 1500, CategoryId = fashion.CategoryId },
                    new Product { ProductName = "Jeans", Price = 1200, CategoryId = fashion.CategoryId },
                    new Product { ProductName = "Jacket", Price = 2500, CategoryId = fashion.CategoryId },

                    // Home Appliances
                    new Product { ProductName = "Washing Machine", Price = 28000, CategoryId = home.CategoryId },
                    new Product { ProductName = "Refrigerator", Price = 35000, CategoryId = home.CategoryId },
                    new Product { ProductName = "Microwave Oven", Price = 12000, CategoryId = home.CategoryId },
                    new Product { ProductName = "Vacuum Cleaner", Price = 9000, CategoryId = home.CategoryId },

                    // Books
                    new Product { ProductName = "ASP.NET Core Guide", Price = 850, CategoryId = books.CategoryId },
                    new Product { ProductName = "Database Systems", Price = 900, CategoryId = books.CategoryId },
                    new Product { ProductName = "Design Patterns", Price = 800, CategoryId = books.CategoryId },

                    // Sports
                    new Product { ProductName = "Cricket Bat", Price = 2000, CategoryId = sports.CategoryId },
                    new Product { ProductName = "Football", Price = 1200, CategoryId = sports.CategoryId },
                    new Product { ProductName = "Gym Gloves", Price = 500, CategoryId = sports.CategoryId },
                    new Product { ProductName = "Skipping Rope", Price = 300, CategoryId = sports.CategoryId }
                );

                await _context.SaveChangesAsync();
            }

            // INVENTORIES (Product , Warehouse) 
            if (!_context.Inventories.Any())
            {
                var products = _context.Products.ToList();
                var warehouses = _context.Warehouses.ToList();

                foreach (var product in products)
                {
                    foreach (var warehouse in warehouses)
                    {
                        _context.Inventories.Add(new Inventory
                        {
                            ProductId = product.ProductId,
                            WarehouseId = warehouse.WarehouseId,
                            Quantity = 0,
                            LastUpdated = DateTime.UtcNow
                        });
                    }
                }

                await _context.SaveChangesAsync();
            }
        }


    
    private async Task CreateUserIfNotExistsAsync(
    UserManager<IdentityUser> userManager,
    RoleManager<IdentityRole> roleManager,
    string email,
    string password,
    string role,
    int? warehouseId = null)
        {
            var user = await userManager.FindByEmailAsync(email);

            if (user != null)
                return;

            user = new IdentityUser
            {
                UserName = email,
                Email = email,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(user, password);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new Exception(errors);
            }

            if (!await roleManager.RoleExistsAsync(role))
                throw new Exception($"Role {role} does not exist");

            await userManager.AddToRoleAsync(user, role);

            // WarehouseManager → add warehouseId claim
            if (role == "WarehouseManager" && warehouseId.HasValue)
            {
                await userManager.AddClaimAsync(
                    user,
                    new System.Security.Claims.Claim(
                        "warehouseId",
                        warehouseId.Value.ToString()
                    )
                );
            }
        }
    }
    }

