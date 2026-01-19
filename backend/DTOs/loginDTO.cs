using System.ComponentModel.DataAnnotations;

namespace MyWebApi.DTOs
{
    public class LoginDTO
    {
        [Required]
        [EmailAddress]
        public required string email { get; set; }

        [Required]
        public required string password { get; set; }
    }
}