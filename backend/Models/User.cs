using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PostgresAPI.Models
{
    public class User
    {
        [Key]
        [Column("id")]
        public int id { get; set; }

        [Column("username")]
        public required string username { get; set; }

        [Column("email")]
        public required string email { get; set; }

        [Column("password")]
        public required string password { get; set; }

        [Column("role")]
        public string role { get; set; } 
        public string? refreshToken { get; set; }
        public DateTime? refreshTokenExpiryTime { get; set; }
    }

}