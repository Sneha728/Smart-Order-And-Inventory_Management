using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartOrderandInventoryApi.DTOs;
using SmartOrderandInventoryApi.Models;
using SmartOrderandInventoryApi.Repositories.Interfaces;
using SmartOrderandInventoryApi.Services.Interfaces;

namespace SmartOrderandInventoryApi.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepo;

        public CategoryService(ICategoryRepository categoryRepo)
        {
            _categoryRepo = categoryRepo;
        }

        public async Task<List<object>> GetAllCategoriesAsync()
        {
            var categories = await _categoryRepo.GetAllAsync();

            return categories
                .Select(c => new
                {
                    c.CategoryId,
                    c.CategoryName,
                    c.IsActive,
                    productCount = c.Products?.Count ?? 0
                })
                .Cast<object>()
                .ToList();
        }

        public async Task<object> GetCategoryByIdAsync(int id)
        {
            var category = await _categoryRepo.GetByIdAsync(id);
            if (category == null)
                throw new Exception("Category not found");

            return new
            {
                category.CategoryId,
                category.CategoryName,
                category.IsActive,
                category.Products.Count

            };
        }

        public async Task CreateCategoryAsync(CategoryDto dto)
        {
            var category = new Category
            {
                CategoryName = dto.CategoryName,
                IsActive = true
            };

            await _categoryRepo.AddAsync(category);
        }

        public async Task UpdateCategoryAsync(int id, CategoryDto dto)
        {
            var category = await _categoryRepo.GetByIdAsync(id);
            if (category == null)
                throw new Exception("Category not found");

            category.CategoryName = dto.CategoryName;
            await _categoryRepo.SaveAsync();
        }

        // TOGGLE STATUS
        public async Task UpdateCategoryStatusAsync(int id,CategoryDto dto)
        {
            var category = await _categoryRepo.GetByIdAsync(id);
            if (category == null)
                throw new Exception("Category not found");

            category.IsActive = !category.IsActive;
            await _categoryRepo.SaveAsync();
        }



        public async Task DeactivateCategoryAsync(int id)
        {
            var category = await _categoryRepo.GetByIdWithProductsAsync(id);
            if (category == null)
                throw new KeyNotFoundException("Category not found");

            if (category.Products.Any())
                throw new InvalidOperationException(
                    "Cannot deactivate category with existing products"
                );

            category.IsActive = false;
            await _categoryRepo.SaveAsync();
        }



    }
}

