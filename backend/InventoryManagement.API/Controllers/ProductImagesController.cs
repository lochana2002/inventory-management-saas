using InventoryManagement.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace InventoryManagement.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProductImagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public ProductImagesController(
            ApplicationDbContext context,
            IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [HttpPost("{productId}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadImage(
            int productId,
            IFormFile image)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            // Find only a product belonging to the logged-in user.
            var product = await _context.Products.FirstOrDefaultAsync(
                p => p.Id == productId && p.UserId == userId);

            if (product == null)
                return NotFound(new { message = "Product not found." });

            if (image == null || image.Length == 0)
                return BadRequest(new { message = "Please select an image." });

            // Maximum image size: 5 MB.
            if (image.Length > 5 * 1024 * 1024)
                return BadRequest(new { message = "Image size cannot exceed 5 MB." });

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var extension = Path.GetExtension(image.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
                return BadRequest(new { message = "Only JPG, JPEG, PNG and WEBP images are allowed." });

            var allowedContentTypes = new[]
            {
                "image/jpeg",
                "image/png",
                "image/webp"
            };

            if (!allowedContentTypes.Contains(image.ContentType.ToLowerInvariant()))
                return BadRequest(new { message = "Invalid image format." });

            // Create the upload directory if it does not exist.
            var uploadFolder = Path.Combine(
                _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot"),
                "uploads",
                "products"
            );

            Directory.CreateDirectory(uploadFolder);

            // Generate a unique filename.
            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadFolder, fileName);

            // Save the uploaded image.
            await using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            // Delete the previous image, if one exists.
            if (!string.IsNullOrEmpty(product.ImageUrl))
            {
                var oldFileName = Path.GetFileName(product.ImageUrl);
                var oldFilePath = Path.Combine(uploadFolder, oldFileName);

                if (System.IO.File.Exists(oldFilePath))
                    System.IO.File.Delete(oldFilePath);
            }

            // Store the relative URL in the database.
            product.ImageUrl = $"/uploads/products/{fileName}";
            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Product image uploaded successfully.",
                imageUrl = product.ImageUrl
            });
        }
    }
}