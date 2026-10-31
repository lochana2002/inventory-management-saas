namespace InventoryManagement.API.DTOs
{
    public class DashboardStatsResponse
    {
        public int TotalProducts { get; set; }

        public int TotalStockQuantity { get; set; }

        public int LowStockProducts { get; set; }

        public decimal TotalInventoryValue { get; set; }
    }
}