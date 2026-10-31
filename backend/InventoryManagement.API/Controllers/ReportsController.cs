using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using InventoryManagement.API.Data;

namespace InventoryManagement.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReportsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetInventoryReport()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // Get only products belonging to the logged-in user.
            var products = _context.Products
                .AsNoTracking()
                .Where(p => p.UserId == userId);

            var totalProducts = await products.CountAsync();

            var totalStockQuantity = await products
                .SumAsync(p => (int?)p.Quantity) ?? 0;

            var totalInventoryValue = await products
                .SumAsync(p => (decimal?)(p.Price * p.Quantity)) ?? 0m;

            var lowStockProducts = await products
                .CountAsync(p => p.Quantity > 0 &&
                                 p.Quantity <= p.LowStockThreshold);

            var outOfStockProducts = await products
                .CountAsync(p => p.Quantity == 0);

            var stockByCategory = await products
                .GroupBy(p => p.Category)
                .Select(group => new
                {
                    Category = group.Key,
                    ProductCount = group.Count(),
                    TotalQuantity = group.Sum(p => p.Quantity),
                    TotalValue = group.Sum(p => p.Price * p.Quantity)
                })
                .OrderBy(group => group.Category)
                .ToListAsync();

            var report = new
            {
                TotalProducts = totalProducts,
                TotalStockQuantity = totalStockQuantity,
                TotalInventoryValue = totalInventoryValue,
                LowStockProducts = lowStockProducts,
                OutOfStockProducts = outOfStockProducts,
                StockByCategory = stockByCategory
            };

            return Ok(report);
        }
    }
}