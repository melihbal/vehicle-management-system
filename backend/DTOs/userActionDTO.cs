namespace PostgresAPI.Models
{
    public class UserActionDTO
    {
        public string UserID { get; set; }
        public string Action { get; set; }
        public DateTime TimeStamp{ get; set; }
    }
}