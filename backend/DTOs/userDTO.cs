namespace MyWebApi.DTOs
{
    public class UserDTO
    {
        public required string username { get; set; }
        public required string password { get; set; }
        public required string email { get; set; }
    }
}
