
using System.ComponentModel.DataAnnotations;

namespace InventoryManagement.API.Models;

public enum StockMovementType
{
    StockIn,
    StockOut
}

public class StockMovement
{
    public int Id { get; set; }

    [Required]
    public int ProductId { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    public StockMovementType Type { get; set; }

    public int Quantity { get; set; }

    public int PreviousQuantity { get; set; }

    public int NewQuantity { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Product? Product { get; set; }

    public ApplicationUser? User { get; set; }
}
