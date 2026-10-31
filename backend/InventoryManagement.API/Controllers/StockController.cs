using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

using InventoryManagement.API.Data;
using InventoryManagement.API.DTOs;
using InventoryManagement.API.Models;

namespace InventoryManagement.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class StockController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StockController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Stock In
        [HttpPost("{productId}/in")]
        public async Task<IActionResult> StockIn(
            int productId,
            [FromBody] StockAdjustmentRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            var product = await _context.Products
                .FirstOrDefaultAsync(p =>
                    p.Id == productId && p.UserId == userId);

            if (product == null)
                return NotFound(new { message = "Product not found." });

            if (product.Quantity > int.MaxValue - request.Quantity)
                return BadRequest(new { message = "Stock quantity exceeds the maximum allowed value." });

            int previousQuantity = product.Quantity;

            product.Quantity += request.Quantity;
            product.UpdatedAt = DateTime.UtcNow;

            var movement = new StockMovement
            {
                ProductId = product.Id,
                UserId = userId,
                Type = StockMovementType.StockIn,
                Quantity = request.Quantity,
                PreviousQuantity = previousQuantity,
                NewQuantity = product.Quantity,
                CreatedAt = DateTime.UtcNow
            };

            _context.StockMovements.Add(movement);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Stock added successfully.",
                productId = product.Id,
                previousQuantity,
                addedQuantity = request.Quantity,
                newQuantity = product.Quantity
            });
        }

        // Stock Out
        [HttpPost("{productId}/out")]
        public async Task<IActionResult> StockOut(
            int productId,
            [FromBody] StockAdjustmentRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            var product = await _context.Products
                .FirstOrDefaultAsync(p =>
                    p.Id == productId && p.UserId == userId);

            if (product == null)
                return NotFound(new { message = "Product not found." });

            if (product.Quantity < request.Quantity)
            {
                return BadRequest(new
                {
                    message = "Insufficient stock. Available quantity is "
                        + product.Quantity
                });
            }

            int previousQuantity = product.Quantity;

            product.Quantity -= request.Quantity;
            product.UpdatedAt = DateTime.UtcNow;

            var movement = new StockMovement
            {
                ProductId = product.Id,
                UserId = userId,
                Type = StockMovementType.StockOut,
                Quantity = request.Quantity,
                PreviousQuantity = previousQuantity,
                NewQuantity = product.Quantity,
                CreatedAt = DateTime.UtcNow
            };

            _context.StockMovements.Add(movement);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Stock removed successfully.",
                productId = product.Id,
                previousQuantity,
                removedQuantity = request.Quantity,
                newQuantity = product.Quantity
            });
        }

        [HttpGet]
public async Task<IActionResult> GetStockMovements()
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

    if (string.IsNullOrEmpty(userId))
    {
        return Unauthorized();
    }

    var movements = await _context.StockMovements
        .Where(m => m.UserId == userId)
        .OrderByDescending(m => m.CreatedAt)
        .Select(m => new
        {
            m.Id,
            m.ProductId,
            ProductName = m.Product!.Name,
            SKU = m.Product!.SKU,
            Type = m.Type.ToString(),
            m.Quantity,
            m.PreviousQuantity,
            m.NewQuantity,
            m.CreatedAt
        })
        .ToListAsync();

    return Ok(movements);
}
    }
}