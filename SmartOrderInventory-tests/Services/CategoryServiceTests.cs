using SmartOrderandInventoryApi.DTOs;
using SmartOrderandInventoryApi.Models;
using SmartOrderandInventoryApi.Repositories;
using SmartOrderandInventoryApi.Services;
using SmartOrderInventory_tests.TestHelpers;
using Xunit;

public class CategoryServiceTests
{
    [Fact]
    public async Task CreateCategory_ShouldAdd()
    {
        var db = TestDbContextFactory.Create();
        var repo = new CategoryRepository(db);
        var service = new CategoryService(repo);

        await service.CreateCategoryAsync(new CategoryDto { CategoryName = "Electronics" });

        Assert.Single(db.Categories);
    }

    [Fact]
    public async Task GetCategory_InvalidId_Throws()
    {
        var service = new CategoryService(
            new CategoryRepository(TestDbContextFactory.Create())
        );

        await Assert.ThrowsAsync<Exception>(() =>
            service.GetCategoryByIdAsync(99));
    }
    [Fact]
    public async Task GetAllCategories_ReturnsList()
    {
        var db = TestDbContextFactory.Create();
        db.Categories.Add(new Category { CategoryName = "Cat1" });
        db.SaveChanges();

        var service = new CategoryService(new CategoryRepository(db));

        var result = await service.GetAllCategoriesAsync();

        Assert.Single(result);
    }

    [Fact]
    public async Task UpdateCategoryStatus_TogglesIsActive()
    {
        var db = TestDbContextFactory.Create();
        var category = new Category { CategoryId = 1, IsActive = true };
        db.Categories.Add(category);
        db.SaveChanges();

        var service = new CategoryService(new CategoryRepository(db));

        await service.UpdateCategoryStatusAsync(1, new CategoryDto());

        Assert.False(db.Categories.First().IsActive);
    }


}
