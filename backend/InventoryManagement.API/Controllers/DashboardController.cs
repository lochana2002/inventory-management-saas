using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

using InventoryManagement.API.Data;
using InventoryManagement.API.DTOs;

namespace InventoryManagement.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<ActionResult<DashboardStatsResponse>> GetStats()
        {
            // Get the logged-in user's ID from the JWT token
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            // Get only products belonging to this user
            var products = _context.Products
                .Where(p => p.UserId == userId);

            var stats = new DashboardStatsResponse
            {
                TotalProducts = await products.CountAsync(),

                TotalStockQuantity = await products
                    .SumAsync(p => p.Quantity),

                LowStockProducts = await products
                    .CountAsync(p => p.Quantity <= p.LowStockThreshold),

                TotalInventoryValue = await products
                    .SumAsync(p => p.Price * p.Quantity)
            };

            return Ok(stats);
        }
    }
}