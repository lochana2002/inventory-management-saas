using System.ComponentModel.DataAnnotations;

namespace InventoryManagement.API.DTOs
{
    public class StockAdjustmentRequest
    {
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; }
    }
}