public class RefreshToken
{
    public int id { get; set; }
    public string token { get; set; }
    public string userEmail { get; set; }
    public DateTime expires { get; set; }
    public bool isRevoked { get; set; }
    
}