using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartOrderandInventoryApi.Data;
using SmartOrderandInventoryApi.DTOs;
using SmartOrderandInventoryApi.Models;
using SmartOrderandInventoryApi.Services;
using SmartOrderandInventoryApi.Services.Interfaces;

namespace SmartOrderandInventoryApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _service;

        public ProductsController(IProductService service)
        {
            _service = service;
        }

        // VIEW PRODUCTS
        [Authorize(Roles = "Admin,SalesExecutive,WarehouseManager,Customer")]
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            return Ok(await _service.GetAllAsync());
        }

        // VIEW PRODUCT BY ID
        [Authorize(Roles = "Admin,SalesExecutive,WarehouseManager,Customer")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var product = await _service.GetProductAsync(id);
            if (product == null)
                return NotFound("Product not found");

            return Ok(product);
        }

        // CREATE PRODUCT
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateProduct(ProductDto dto)
        {
            await _service.CreateProductAsync(dto);
            return Ok("Product created successfully");
        }

        // UPDATE PRODUCT
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, ProductDto dto)
        {
            await _service.UpdateProductAsync(id, dto);
            return Ok("Product updated successfully");
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateProductStatus(int id,ProductDto dto)
        {
            await _service.UpdateProductStatusAsync(id,dto);
            return Ok("Product status updated");
        }


        // DEACTIVATE PRODUCT
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            await _service.DeleteProductAsync(id);
            return Ok("Product deactivated successfully");
        }
    }
}