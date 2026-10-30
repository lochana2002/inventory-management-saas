using InventoryManagement.API.Data;
using InventoryManagement.API.DTOs;
using InventoryManagement.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace InventoryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProductsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Products
    // Get all products belonging to the logged-in user.
    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
            return Unauthorized();

        var products = await _context.Products
            .AsNoTracking()
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return Ok(products);
    }

    // GET: api/Products/5
    // Get a specific product.
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetProductById(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
            return Unauthorized();

        var product = await _context.Products
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

        if (product == null)
            return NotFound(new { Message = "Product not found." });

        return Ok(product);
    }

    // POST: api/Products
    // Create a new product.
    [HttpPost]
    public async Task<IActionResult> CreateProduct(CreateProductRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
            return Unauthorized();

        // Check whether this user already has the same SKU.
        var skuExists = await _context.Products
            .AnyAsync(p => p.UserId == userId && p.SKU == request.SKU);

        if (skuExists)
        {
            return Conflict(new
            {
                Message = "A product with this SKU already exists."
            });
        }

        var product = new Product
        {
            UserId = userId,
            Name = request.Name,
            SKU = request.SKU,
            Category = request.Category,
            Price = request.Price,
            Quantity = request.Quantity,
            LowStockThreshold = request.LowStockThreshold,
            CreatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetProductById),
            new { id = product.Id },
            product
        );
    }

    // PUT: api/Products/5
    // Update an existing product.
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateProduct(
        int id,
        UpdateProductRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
            return Unauthorized();

        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

        if (product == null)
            return NotFound(new { Message = "Product not found." });

        // Check whether another product owned by this user uses the SKU.
        var skuExists = await _context.Products
            .AnyAsync(p =>
                p.UserId == userId &&
                p.SKU == request.SKU &&
                p.Id != id);

        if (skuExists)
        {
            return Conflict(new
            {
                Message = "Another product with this SKU already exists."
            });
        }

        product.Name = request.Name;
        product.SKU = request.SKU;
        product.Category = request.Category;
        product.Price = request.Price;
        product.Quantity = request.Quantity;
        product.LowStockThreshold = request.LowStockThreshold;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(product);
    }

    // DELETE: api/Products/5
    // Delete a product.
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
            return Unauthorized();

        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

        if (product == null)
            return NotFound(new { Message = "Product not found." });

        _context.Products.Remove(product);

        await _context.SaveChangesAsync();

        return Ok(new { Message = "Product deleted successfully." });
    }
}