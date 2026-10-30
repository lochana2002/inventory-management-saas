
using Microsoft.AspNetCore.Identity;

namespace InventoryManagement.API.Models;

public class ApplicationUser : IdentityUser
{
    public string? FullName { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Product> Products { get; set; } = new List<Product>();

    public ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
}
